import mongoose from "mongoose"
import fs from "node:fs"
import path from "node:path"
import "../src/configs/env.config.js"
import {
  connectMongoDB,
  disconnectMongoDB,
} from "../src/configs/mongoose.connect.js"
import User from "../src/models/user.model.js"
import Book from "../src/models/book.model.js"

// 1. Read the dataset
const datasetPath = path.resolve(
  process.cwd(),
  "data/bookleaf_sample_data.json"
)

const rawData = fs.readFileSync(datasetPath, "utf-8")
const { authors } = JSON.parse(rawData)

// 2. Map dataset-specific statuses to our canonical statuses
const statusMap = {
  "In Production - Cover Design": "Cover Design",
  "In Production - Typesetting": "Typesetting",
}

const seedDatabase = async () => {
  try {
    if (!Array.isArray(authors) || authors.length === 0) {
      throw new Error("Dataset does not contain a valid authors array")
    }

    await connectMongoDB(`${process.env.MONGO_URI}`)

    const bookOperations = []

    // 3. Process each author
    for (const authorData of authors) {
      const user = await User.findOneAndUpdate(
        { author_id: authorData.author_id },
        {
          $set: {
            author_id: authorData.author_id,
            name: authorData.name,
            email: authorData.email,
            phone: authorData.phone,
            city: authorData.city,
            joined_date: authorData.joined_date
              ? new Date(authorData.joined_date)
              : null,
            role: "author",
          },
        },
        {
          upsert: true,
          returnDocument: "after",
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      )

      // 4. Prepare this author's books
      for (const bookData of authorData.books ?? []) {
        const normalizedStatus = statusMap[bookData.status] || bookData.status

        bookOperations.push({
          updateOne: {
            filter: { book_id: bookData.book_id },
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

    // 5. Write all books to MongoDB
    if (bookOperations.length > 0) {
      await Book.bulkWrite(bookOperations)
    }

    // 6. Verify seeded records
    const authorIds = authors.map((author) => author.author_id)
    const bookIds = bookOperations.map(
      (operation) => operation.updateOne.filter.book_id
    )

    const authorCount = await User.countDocuments({
      author_id: { $in: authorIds },
    })

    const bookCount = await Book.countDocuments({
      book_id: { $in: bookIds },
    })

    console.log("Database seeding completed!")
    console.log(`Authors verified: ${authorCount}`)
    console.log(`Books verified: ${bookCount}`)

    if (authorCount !== 11 || bookCount !== 18) {
      throw new Error(
        "Seed verification failed: expected 10 authors and 18 books"
      )
    }
  } catch (error) {
    console.error("Database seeding failed:", error)
    process.exitCode = 1
  } finally {
    await disconnectMongoDB(`${process.env.MONGO_URI}`)
  }
}

seedDatabase()
