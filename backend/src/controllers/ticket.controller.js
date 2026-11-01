import { createAuthorTicket } from "../services/ticket.service.js"
import Ticket from "../models/ticket.model.js"
import Message from "../models/message.model.js"
import mongoose from "mongoose"
export const handleCreateTicket = async (req, res, next) => {
  try {
    const { book, subject, description } = req.body

    // Validate required fields.
    if (!subject?.trim() || !description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject and description are required.",
      })
    }

    if (subject.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: "Subject cannot exceed 200 characters.",
      })
    }

    if (description.trim().length > 10000) {
      return res.status(400).json({
        success: false,
        message: "Description cannot exceed 10000 characters.",
      })
    }

    // Empty book selection means General / Account Level.
    const bookId = book?.trim() || null

    const result = await createAuthorTicket({
      authorId: req.session.user.id,
      bookId,
      subject: subject.trim(),
      description: description.trim(),
      files: req.files || [],
    })

    return res.status(201).json({
      success: true,
      message: "Support ticket created successfully.",
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const handleGetAuthorTickets = async (req, res, next) => {
  try {
    // 1. Get author identity from authenticated session.
    const authorId = req.session.user.id

    // 2. Read pagination parameters.
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1)

    const limit = Math.min(
      50,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    )

    const skip = (page - 1) * limit

    // 3. Fetch only this author's tickets.
    const [tickets, totalTickets] = await Promise.all([
      Ticket.find({ author: authorId })
        .select(
          "subject status category priority book lastActivityAt createdAt updatedAt"
        )
        .populate("book", "title book_id")
        .sort({ lastActivityAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Ticket.countDocuments({ author: authorId }),
    ])

    // 4. Return paginated results.
    return res.status(200).json({
      success: true,
      data: {
        tickets,
        pagination: {
          currentPage: page,
          limit,
          totalTickets,
          totalPages: Math.ceil(totalTickets / limit),
          hasNextPage: page * limit < totalTickets,
          hasPreviousPage: page > 1,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

export const handleGetAuthorTicketById = async (req, res, next) => {
  try {
    const authorId = req.session.user.id
    const { ticketId } = req.params

    // 1. Validate MongoDB ObjectId.
    if (!mongoose.isValidObjectId(ticketId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID.",
      })
    }

    // 2. Verify ticket ownership.
    const ticket = await Ticket.findOne({
      _id: ticketId,
      author: authorId,
    })
      .populate("book", "title book_id isbn")
      .select("-__v")
      .lean()

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      })
    }

    // 3. Fetch only publicly visible messages.
    const messages = await Message.find({
      ticket: ticketId,
      visibility: "public",
    })
      .select("-__v")
      .populate("sender", "name role")
      .sort({ createdAt: 1 })
      .lean()

    // 4. Return ticket and conversation.
    return res.status(200).json({
      success: true,
      data: {
        ticket,
        messages,
      },
    })
  } catch (error) {
    next(error)
  }
}
