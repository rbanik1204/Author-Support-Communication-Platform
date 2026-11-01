import fs from "node:fs"
import path from "node:path"
import "../src/configs/env.config.js"

import bcrypt from "bcrypt"

import {
  connectMongoDB,
  disconnectMongoDB,
} from "../src/configs/mongoose.connect.js"

import User from "../src/models/user.model.js"
import Book from "../src/models/book.model.js"

import { generatePasswordSetupToken } from "../src/utils/passwordSetupToken.js"

// 1. Read dataset
const datasetPath = path.resolve(
  process.cwd(),
  "data/bookleaf_sample_data.json"
)

const rawData = fs.readFileSync(datasetPath, "utf-8")
const { authors } = JSON.parse(rawData)

// 2. Status normalization
const statusMap = {
  "In Production - Cover Design": "Cover Design",
  "In Production - Typesetting": "Typesetting",
}

const seedDatabase = async () => {
  let connected = false

  try {
    if (!Array.isArray(authors) || authors.length === 0) {
      throw new Error("Invalid authors dataset")
    }

    const { MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, FRONTEND_URL } =
      process.env

    if (
      !MONGO_URI ||
      !ADMIN_NAME ||
      !ADMIN_EMAIL ||
      !ADMIN_PASSWORD ||
      !FRONTEND_URL
    ) {
      throw new Error("Missing required environment variables")
    }

    if (
      Buffer.byteLength(ADMIN_PASSWORD, "utf8") < 12 ||
      Buffer.byteLength(ADMIN_PASSWORD, "utf8") > 72
    ) {
      throw new Error("Admin password must be between 12 and 72 bytes")
    }

    await connectMongoDB(MONGO_URI)
    connected = true

    const invitationCredentials = []
    const bookOperations = []

    // 3. Seed authors
    for (const authorData of authors) {
      let user = await User.findOne({
        author_id: authorData.author_id,
      }).select("+passwordSetupTokenHash +passwordSetupExpiresAt")

      if (!user) {
        user = await User.create({
          author_id: authorData.author_id,
          name: authorData.name,
          email: authorData.email,
          phone: authorData.phone,
          city: authorData.city,
          joined_date: authorData.joined_date
            ? new Date(authorData.joined_date)
            : null,
          role: "author",
          isPasswordSet: false,
        })
      } else {
        // Update dataset fields without overwriting auth fields.
        user.name = authorData.name
        user.email = authorData.email.toLowerCase()
        user.phone = authorData.phone
        user.city = authorData.city
        user.joined_date = authorData.joined_date
          ? new Date(authorData.joined_date)
          : null

        await user.save()
      }

      // 4. Generate invitation if password is not set
      if (!user.isPasswordSet) {
        const hasOutstandingInvitation =
          user.passwordSetupTokenHash &&
          user.passwordSetupExpiresAt &&
          user.passwordSetupExpiresAt > new Date()

        if (!hasOutstandingInvitation) {
          const { token, tokenHash, expiresAt } = generatePasswordSetupToken()

          user.passwordSetupTokenHash = tokenHash
          user.passwordSetupExpiresAt = expiresAt

          await user.save()

          const setupUrl = new URL("/set-password", FRONTEND_URL)

          setupUrl.searchParams.set("token", token)

          invitationCredentials.push({
            name: user.name,
            email: user.email,
            role: "author",
            setupUrl: setupUrl.toString(),
            expiresAt,
          })
        }
      }

      // 5. Prepare book operations
      for (const bookData of authorData.books ?? []) {
        const normalizedStatus = statusMap[bookData.status] || bookData.status

        bookOperations.push({
          updateOne: {
            filter: {
              book_id: bookData.book_id,
            },
            update: {
              $set: {
                book_id: bookData.book_id,
                author: user._id,
                title: bookData.title,
                isbn: bookData.isbn,
                genre: bookData.genre,
                publication_date: bookData.publication_date
                  ? new Date(bookData.publication_date)
                  : null,
                status: normalizedStatus,
                mrp: bookData.mrp ?? null,
                author_royalty_per_copy:
                  bookData.author_royalty_per_copy ?? null,
                total_copies_sold: bookData.total_copies_sold ?? 0,
                total_royalty_earned: bookData.total_royalty_earned ?? 0,
                royalty_paid: bookData.royalty_paid ?? 0,
                royalty_pending: bookData.royalty_pending ?? 0,
                last_royalty_payout_date: bookData.last_royalty_payout_date
                  ? new Date(bookData.last_royalty_payout_date)
                  : null,
                print_partner: bookData.print_partner ?? null,
                available_on: bookData.available_on ?? [],
              },
            },
            upsert: true,
          },
        })
      }
    }
    // 6. Create admin if it does not exist
    const adminEmail = ADMIN_EMAIL.trim().toLowerCase()

    const existingAdminEmail = await User.findOne({
      email: adminEmail,
      role: "author",
    })

    if (existingAdminEmail) {
      throw new Error("Admin email already belongs to an author account.")
    }

    const existingAdmin = await User.findOne({
      email: adminEmail,
    })

    if (existingAdmin && existingAdmin.role !== "admin") {
      throw new Error("Admin email already belongs to a non-admin account.")
    }

    if (!existingAdmin) {
      const adminPasswordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)

      await User.create({
        name: ADMIN_NAME,
        email: adminEmail,
        role: "admin",
        passwordHash: adminPasswordHash,
        isPasswordSet: true,
      })
    }

    // 7. Write books
    if (bookOperations.length > 0) {
      await Book.bulkWrite(bookOperations)
    }

    // 8. Save private invitation credentials
    if (invitationCredentials.length > 0) {
      const credentialsPath = path.resolve(
        process.cwd(),
        "scripts/demo-credentials.json"
      )

      fs.writeFileSync(
        credentialsPath,
        JSON.stringify(invitationCredentials, null, 2),
        { mode: 0o600 }
      )
    }

    // 9. Verify
    const authorIds = authors.map((author) => author.author_id)

    const bookIds = bookOperations.map(
      (operation) => operation.updateOne.filter.book_id
    )

    const authorCount = await User.countDocuments({
      author_id: { $in: authorIds },
      role: "author",
    })

    const bookCount = await Book.countDocuments({
      book_id: { $in: bookIds },
    })

    const adminCount = await User.countDocuments({
      email: adminEmail,
      role: "admin",
    })

    console.log("Database seeding completed!")
    console.log(`Authors verified: ${authorCount}`)
    console.log(`Books verified: ${bookCount}`)
    console.log(`Admins verified: ${adminCount}`)
    console.log(`New invitations generated: ${invitationCredentials.length}`)

    if (
      authorCount !== authors.length ||
      bookCount !== bookIds.length ||
      adminCount !== 1
    ) {
      throw new Error("Seed verification failed")
    }
  } catch (error) {
    console.error("Database seeding failed:", error)
    process.exitCode = 1
  } finally {
    if (connected) {
      await disconnectMongoDB(process.env.MONGO_URI)
    }
  }
}

seedDatabase()
