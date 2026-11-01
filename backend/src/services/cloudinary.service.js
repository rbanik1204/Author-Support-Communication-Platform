import cloudinary from "../configs/cloudinary.config.js"

export const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const resourceType = file.mimetype === "application/pdf" ? "raw" : "image"

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "bookleaf/ticket-attachments",
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        filename_override: file.originalname,
        public_id:
          resourceType === "raw"
            ? `${Date.now()}-${file.originalname}`
            : undefined,
      },
      (error, result) => {
        if (error) return reject(error)

        resolve({
          originalName: file.originalname,
          filename: result.public_id.split("/").pop(),
          mimeType: file.mimetype,
          size: file.size,
          url: result.secure_url,
          publicId: result.public_id,
          resourceType,
        })
      }
    )

    uploadStream.end(file.buffer)
  })
}

export const deleteFile = async (publicId, resourceType) => {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  })
}
