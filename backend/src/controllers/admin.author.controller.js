import User from "../models/user.model.js"
import { generatePasswordSetupToken } from "../utils/passwordSetupToken.js"

export const handleCreateAuthor = async (req, res, next) => {
  try {
    const { name, email, author_id } = req.body

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof author_id !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !author_id.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and author ID are required.",
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedAuthorId = author_id.trim()

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { author_id: normalizedAuthorId }],
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email or author ID already exists.",
      })
    }

    const { token, tokenHash, expiresAt } = generatePasswordSetupToken()

    const author = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      author_id: normalizedAuthorId,
      role: "author",
      isPasswordSet: false,
      passwordSetupTokenHash: tokenHash,
      passwordSetupExpiresAt: expiresAt,
    })

    const setupUrl = new URL("/set-password", process.env.FRONTEND_URL)

    setupUrl.searchParams.set("token", token)

    return res.status(201).json({
      success: true,
      message: "Author account created successfully.",
      author: {
        id: author._id,
        name: author.name,
        email: author.email,
        author_id: author.author_id,
      },
      invitation: {
        setupUrl: setupUrl.toString(),
        expiresAt,
      },
    })
  } catch (error) {
    next(error)
  }
}
