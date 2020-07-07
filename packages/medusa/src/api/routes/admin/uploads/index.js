import { Router } from "express"
import multer from "multer"

import middlewares from "../../../middlewares"

const route = Router()
const upload = multer({ dest: "uploads/" })

export default app => {
  app.use("/uploads", route)

  route.post(
    "/",
    upload.array("files"),
    middlewares.wrap(require("./create-upload").default)
  )

  return app
}
