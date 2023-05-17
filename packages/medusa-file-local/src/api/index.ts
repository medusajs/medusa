import express from "express"

export default () => {
  const app = express.Router()

  const uploadDir = process.env.UPLOAD_DIR ?? "uploads/images"

  app.use(`/${uploadDir}`, express.static(uploadDir))

  return app
}
