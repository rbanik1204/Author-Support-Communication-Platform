import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    author_id: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    joined_date: {
      type: Date,
    },

    role: {
      type: String,
      enum: ["author", "admin"],
      default: "author",
      required: true,
    },

    google_sub: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
)

const User = mongoose.model("User", userSchema)

export default User
