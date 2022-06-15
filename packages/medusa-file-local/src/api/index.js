import express from "express"
const { Router } = express

export default () => {
  const route = Router()
  const uploadDir = process.env.UPLOAD_DIR ?? "uploads/images"

  route.use(`/${uploadDir}`, express.static(uploadDir))

  return route
}
