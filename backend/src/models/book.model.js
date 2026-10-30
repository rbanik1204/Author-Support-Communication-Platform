import mongoose from "mongoose"

const bookSchema = new mongoose.Schema(
  {
    book_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    isbn: {
      type: String,
      required: true,
      trim: true,
    },

    genre: {
      type: String,
      required: true,
      trim: true,
    },

    publication_date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: [
        "Manuscript Received",
        "In Production - Editing (if opted)",
        "InCover Design",
        "In Production - Typesetting",
        "In Production - Proofreading",
        "In Production - ISBN Assignment",
        "In Production - Printing",
        "In Production - Distribution Setup",
        "Published & Live",
      ],
    },

    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    author_royalty_per_copy: {
      type: Number,
      required: true,
      min: 0,
    },

    total_copies_sold: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    total_royalty_earned: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    royalty_paid: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    royalty_pending: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    last_royalty_payout_date: {
      type: Date,
    },

    print_partner: {
      type: String,
      trim: true,
    },

    available_on: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "books",
  }
)

// Frequently used when retrieving books for an author
bookSchema.index({ author: 1 })

const Book = mongoose.model("Book", bookSchema)

export default Book
