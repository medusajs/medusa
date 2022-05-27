import { Router } from "express"
import multer from "multer"
import { DeleteResponse } from "../../../../types/common"

import middlewares from "../../../middlewares"

const route = Router()
const upload = multer({ dest: "uploads/" })

export default (app) => {
  app.use("/uploads", route)

  route.post(
    "/",
    upload.array("files"),
    middlewares.wrap(require("./create-upload").default)
  )

  // removed on purpose
  // route.post("/delete", middlewares.wrap(require("./delete-upload").default))

  return app
}

export type AdminUploadRes = {
  uploads: unknown[]
}

export type AdminDeleteUploadRes = DeleteResponse

export * from "./create-upload"
// export * from "./delete-upload"
