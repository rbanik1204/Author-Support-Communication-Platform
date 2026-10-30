import mongoose from "mongoose"

const ticketSchema = new mongoose.Schema(
  {
    // Author who created this ticket
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Related book (null for General / Account Level tickets)
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      default: null,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    // Support ticket lifecycle
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
      required: true,
    },

    // AI classification
    category: {
      type: String,
      enum: [
        "Royalty & Payments",
        "ISBN & Metadata Issues",
        "Printing & Quality",
        "Distribution & Availability",
        "Book Status & Production Updates",
        "General Inquiry",
      ],
      default: "General Inquiry",
      required: true,
    },

    categorySource: {
      type: String,
      enum: ["ai", "admin", "default"],
      default: "default",
    },

    // AI priority assessment
    priority: {
      type: String,
      enum: ["Critical", "High", "Medium", "Low"],
      default: "Medium",
      required: true,
    },

    prioritySource: {
      type: String,
      enum: ["ai", "admin", "default"],
      default: "default",
    },

    // Admin assignment
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // AI processing information
    aiProcessingStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },

    aiProcessingError: {
      type: String,
      default: null,
    },

    // Generated suggestion, not yet sent to the author
    aiDraft: {
      type: String,
      default: null,
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "tickets",
  }
)

// Useful indexes for author history and admin queue
ticketSchema.index({ author: 1, createdAt: -1 })
ticketSchema.index({ status: 1, priority: 1, createdAt: 1 })
ticketSchema.index({ assignedTo: 1 })

const Ticket = mongoose.model("Ticket", ticketSchema)

export default Ticket
