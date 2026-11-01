import mongoose from "mongoose"

const messageSchema = new mongoose.Schema(
  {
    // Ticket to which this message belongs
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },

    // User who sent this message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderRole: {
      type: String,
      enum: ["author", "admin"],
      required: true,
    },

    // Type of communication
    type: {
      type: String,
      enum: ["author_query", "admin_reply", "internal_note"],
      required: true,
    },

    // Whether the author can see this message
    visibility: {
      type: String,
      enum: ["public", "internal"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },

    // Attachment metadata, not the actual file
    attachments: {
      type: [
        {
          originalName: {
            type: String,
            required: true,
          },
          filename: {
            type: String,
            required: true,
          },
          mimeType: {
            type: String,
            required: true,
          },
          size: {
            type: Number,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
          publicId: {
            type: String,
            required: true,
          },
          resourceType: {
            type: String,
            enum: ["image", "raw"],
            default: null,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "messages",
  }
)

// Retrieve a ticket's conversation chronologically
messageSchema.index({ ticket: 1, createdAt: 1 })

// Useful for finding messages sent by a particular user
messageSchema.index({ sender: 1, createdAt: -1 })

const Message = mongoose.model("Message", messageSchema)

export default Message
