import multer from "multer"

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png"]

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only PDF, JPEG and PNG files are allowed."))
  }

  cb(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 3,
  },
})

export default upload
