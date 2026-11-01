import multer from "multer"
import upload from "../configs/upload.config.js"

export const uploadTicketAttachments = (req, res, next) => {
  const handleUpload = upload.array("attachments", 3)

  handleUpload(req, res, (error) => {
    if (!error) {
      return next()
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Each attachment must be smaller than 5 MB.",
        })
      }

      if (
        error.code === "LIMIT_FILE_COUNT" ||
        error.code === "LIMIT_UNEXPECTED_FILE"
      ) {
        return res.status(400).json({
          success: false,
          message: "You can upload a maximum of 3 attachments.",
        })
      }
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Invalid attachment.",
    })
  })
}
