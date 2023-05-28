import express from "express"

export default (rootDirectory, pluginOptions) => {
  const app = express.Router()

  const uploadDir = pluginOptions.upload_dir ?? "uploads/images"

  app.use(`/${uploadDir}`, express.static(uploadDir))

  return app
}
