import mongoose from "mongoose"
import Book from "../models/book.model.js"
import Ticket from "../models/ticket.model.js"
import Message from "../models/message.model.js"
import { uploadFile, deleteFile } from "./cloudinary.service.js"
import { classifyTicket } from "./ai-classification.service.js"

const cleanupUploadedFiles = async (attachments) => {
  await Promise.allSettled(
    attachments.map((file) => deleteFile(file.publicId, file.resourceType))
  )
}

export const createAuthorTicket = async ({
  authorId,
  bookId,
  subject,
  description,
  files = [],
}) => {
  let uploadedAttachments = []

  // 1. Validate book ownership before uploading anything.
  let selectedBook = null

  if (bookId) {
    if (!mongoose.isValidObjectId(bookId)) {
      const error = new Error("Invalid book ID.")
      error.statusCode = 400
      throw error
    }

    selectedBook = await Book.findOne({
      _id: bookId,
      author: authorId,
    })

    if (!selectedBook) {
      const error = new Error("Book not found or does not belong to you.")
      error.statusCode = 404
      throw error
    }
  }

  // 2. Upload attachments to Cloudinary.
  const uploadResults = await Promise.allSettled(
    files.map((file) => uploadFile(file))
  )

  uploadedAttachments = uploadResults
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value)

  const failedUpload = uploadResults.find(
    (result) => result.status === "rejected"
  )

  if (failedUpload) {
    await cleanupUploadedFiles(uploadedAttachments)
    throw failedUpload.reason
  }

  // 3. Create Ticket and Message atomically in MongoDB.
  const session = await mongoose.startSession()

  try {
    let createdTicket
    let createdMessage

    await session.withTransaction(async () => {
      const [ticket] = await Ticket.create(
        [
          {
            author: authorId,
            book: selectedBook?._id || null,
            subject,
          },
        ],
        { session }
      )

      const [message] = await Message.create(
        [
          {
            ticket: ticket._id,
            sender: authorId,
            senderRole: "author",
            type: "author_query",
            visibility: "public",
            content: description,
            attachments: uploadedAttachments,
          },
        ],
        { session }
      )

      createdTicket = ticket
      createdMessage = message
    })

    // 5. Start AI classification without blocking ticket creation.
    setImmediate(() => {
      processTicketClassification({
        ticketId: createdTicket._id,
        subject,
        description,
      })
    })

    return {
      ticket: createdTicket,
      message: createdMessage,
    }
  } catch (error) {
    // 4. Compensating cleanup if the DB transaction fails.
    await cleanupUploadedFiles(uploadedAttachments)
    throw error
  } finally {
    await session.endSession()
  }
}
const processTicketClassification = async ({
  ticketId,
  subject,
  description,
}) => {
  try {
    // 1. Mark AI processing as started.
    await Ticket.findByIdAndUpdate(ticketId, {
      $set: {
        aiProcessingStatus: "processing",
        aiProcessingError: null,
      },
    })

    // 2. Ask Gemini to classify the ticket.
    const classification = await classifyTicket({
      subject,
      description,
    })

    // 3. Handle provider/API failure gracefully.
    if (!classification.success) {
      await Ticket.findByIdAndUpdate(ticketId, {
        $set: {
          aiProcessingStatus: "failed",
          aiProcessingError: classification.error,
        },
      })

      return
    }

    const { category, priority } = classification.data

    // 4. Save AI classification without overwriting admin overrides.
    await Ticket.updateOne({ _id: ticketId }, [
      {
        $set: {
          category: {
            $cond: [
              { $eq: ["$categorySource", "default"] },
              category,
              "$category",
            ],
          },
          categorySource: {
            $cond: [
              { $eq: ["$categorySource", "default"] },
              "ai",
              "$categorySource",
            ],
          },
          priority: {
            $cond: [
              { $eq: ["$prioritySource", "default"] },
              priority,
              "$priority",
            ],
          },
          prioritySource: {
            $cond: [
              { $eq: ["$prioritySource", "default"] },
              "ai",
              "$prioritySource",
            ],
          },
          aiProcessingStatus: "completed",
          aiProcessingError: null,
        },
      },
    ])
  } catch (error) {
    console.error("Background ticket classification failed:", error)

    await Ticket.findByIdAndUpdate(ticketId, {
      $set: {
        aiProcessingStatus: "failed",
        aiProcessingError: error.message,
      },
    }).catch((updateError) => {
      console.error("Failed to update AI processing status:", updateError)
    })
  }
}
