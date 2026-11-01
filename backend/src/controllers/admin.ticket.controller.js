import Ticket from "../models/ticket.model.js"
import User from "../models/user.model.js"
import mongoose from "mongoose"
import Message from "../models/message.model.js"

const TICKET_STATUSES = ["Open", "In Progress", "Resolved", "Closed"]

const TICKET_CATEGORIES = [
  "Royalty & Payments",
  "ISBN & Metadata Issues",
  "Printing & Quality",
  "Distribution & Availability",
  "Book Status & Production Updates",
  "General Inquiry",
]

const TICKET_PRIORITIES = ["Critical", "High", "Medium", "Low"]

// Escape special regex characters in search input.
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export const handleGetAdminTickets = async (req, res, next) => {
  try {
    // 1. Read query parameters.
    const { status, category, priority, search } = req.query

    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1)

    const limit = Math.min(
      50,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    )

    const skip = (page - 1) * limit

    // 2. Validate filters.
    if (status && !TICKET_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket status filter.",
      })
    }

    if (category && !TICKET_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket category filter.",
      })
    }

    if (priority && !TICKET_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket priority filter.",
      })
    }

    // 3. Build database query.
    const filter = {}

    if (status) filter.status = status
    if (category) filter.category = category
    if (priority) filter.priority = priority

    // 4. Search subject, author name and email.
    if (search?.trim()) {
      const searchRegex = new RegExp(escapeRegex(search.trim()), "i")

      const matchingAuthors = await User.find({
        $or: [{ name: searchRegex }, { email: searchRegex }],
      }).distinct("_id")

      const searchConditions = [{ subject: searchRegex }]

      if (matchingAuthors.length > 0) {
        searchConditions.push({
          author: { $in: matchingAuthors },
        })
      }

      filter.$or = searchConditions
    }

    // 5. Fetch count and paginated tickets.
    const [tickets, totalTickets] = await Promise.all([
      Ticket.aggregate([
        { $match: filter },

        // Critical -> High -> Medium -> Low.
        {
          $addFields: {
            priorityOrder: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$priority", "Critical"] },
                    then: 1,
                  },
                  {
                    case: { $eq: ["$priority", "High"] },
                    then: 2,
                  },
                  {
                    case: { $eq: ["$priority", "Medium"] },
                    then: 3,
                  },
                  {
                    case: { $eq: ["$priority", "Low"] },
                    then: 4,
                  },
                ],
                default: 5,
              },
            },
          },
        },

        // Older tickets appear first at the same priority.
        {
          $sort: {
            priorityOrder: 1,
            createdAt: 1,
            _id: 1,
          },
        },

        { $skip: skip },
        { $limit: limit },

        // Author details.
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
            preserveNullAndEmptyArrays: true,
          },
        },

        // Associated book details.
        {
          $lookup: {
            from: "books",
            localField: "book",
            foreignField: "_id",
            as: "book",
          },
        },
        {
          $unwind: {
            path: "$book",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            priorityOrder: 0,
            "author.google_sub": 0,
            "author.__v": 0,
            "book.__v": 0,
          },
        },
      ]),

      Ticket.countDocuments(filter),
    ])

    // 6. Return results.
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

export const handleGetAdminTicketById = async (req, res, next) => {
  try {
    const { ticketId } = req.params

    if (!mongoose.isValidObjectId(ticketId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID.",
      })
    }

    // Fetch ticket with author, book and assigned admin.
    const ticket = await Ticket.findById(ticketId)
      .populate("author", "name email phone city author_id")
      .populate("book", "title book_id isbn genre")
      .populate("assignedTo", "name email")
      .select("-__v")
      .lean()

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      })
    }

    // Admin can see both public replies and internal notes.
    const messages = await Message.find({
      ticket: ticketId,
    })
      .populate("sender", "name email role")
      .sort({ createdAt: 1 })
      .select("-__v")
      .lean()

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

export const handleUpdateTicketStatus = async (req, res, next) => {
  try {
    const { ticketId } = req.params
    const { status } = req.body

    const allowedStatuses = ["Open", "In Progress", "Resolved", "Closed"]

    // 1. Validate ticket ID.
    if (!mongoose.isValidObjectId(ticketId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID.",
      })
    }

    // 2. Validate requested status.
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket status.",
      })
    }

    // 3. Find ticket.
    const ticket = await Ticket.findById(ticketId)

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      })
    }

    // 4. Update status timestamps.
    const now = new Date()

    ticket.status = status
    ticket.lastActivityAt = now

    if (status === "Resolved") {
      ticket.resolvedAt = now
      ticket.closedAt = null
    } else if (status === "Closed") {
      ticket.closedAt = now

      if (!ticket.resolvedAt) {
        ticket.resolvedAt = now
      }
    } else {
      ticket.resolvedAt = null
      ticket.closedAt = null
    }

    await ticket.save()

    return res.status(200).json({
      success: true,
      message: "Ticket status updated successfully.",
      data: {
        ticketId: ticket._id,
        status: ticket.status,
        resolvedAt: ticket.resolvedAt,
        closedAt: ticket.closedAt,
        lastActivityAt: ticket.lastActivityAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const handleAssignTicketToSelf = async (req, res, next) => {
  try {
    const { ticketId } = req.params

    // 1. Validate ticket ID.
    if (!mongoose.isValidObjectId(ticketId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID.",
      })
    }

    // 2. Get the authenticated admin's ID.
    const adminId = req.session.user.id

    // 3. Find ticket.
    const ticket = await Ticket.findById(ticketId)

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      })
    }

    // 4. Assign ticket to current admin.
    ticket.assignedTo = adminId
    ticket.lastActivityAt = new Date()

    await ticket.save()

    return res.status(200).json({
      success: true,
      message: "Ticket assigned successfully.",
      data: {
        ticketId: ticket._id,
        assignedTo: ticket.assignedTo,
        lastActivityAt: ticket.lastActivityAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const handleCreateAdminMessage = async (req, res, next) => {
  const session = await mongoose.startSession()

  try {
    const { ticketId } = req.params
    const { content, type } = req.body

    // 1. Validate ticket ID.
    if (!mongoose.isValidObjectId(ticketId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID.",
      })
    }

    // 2. Validate message content.
    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content is required.",
      })
    }

    if (content.trim().length > 10000) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 10000 characters.",
      })
    }

    // 3. Validate message type.
    const allowedTypes = ["admin_reply", "internal_note"]

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message type.",
      })
    }

    const visibility = type === "admin_reply" ? "public" : "internal"

    const adminId = req.session.user.id
    const now = new Date()

    let createdMessage

    // 4. Create message and update ticket atomically.
    await session.withTransaction(async () => {
      const ticket = await Ticket.findById(ticketId).session(session)

      if (!ticket) {
        const error = new Error("Ticket not found.")
        error.statusCode = 404
        throw error
      }

      const [message] = await Message.create(
        [
          {
            ticket: ticket._id,
            sender: adminId,
            senderRole: "admin",
            type,
            visibility,
            content: content.trim(),
          },
        ],
        { session }
      )

      ticket.lastActivityAt = now

      await ticket.save({ session })

      createdMessage = message
    })

    // 5. Return the created message.
    return res.status(201).json({
      success: true,
      message:
        type === "admin_reply"
          ? "Reply sent successfully."
          : "Internal note added successfully.",
      data: {
        message: createdMessage,
      },
    })
  } catch (error) {
    if (error.message === "Ticket not found.") {
      return res.status(404).json({
        success: false,
        message: error.message,
      })
    }

    next(error)
  } finally {
    await session.endSession()
  }
}
