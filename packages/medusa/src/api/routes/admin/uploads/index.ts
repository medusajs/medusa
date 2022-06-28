import { Router } from "express"
import multer from "multer"
import { DeleteResponse } from "../../../../types/common"

import middlewares, { transformBody } from "../../../middlewares"
import { AdminDeleteUploadReq } from "./delete-upload"
import { AdminCreateUploadsFileDownloadUrlReq } from "./get-download-url"

const route = Router()
const upload = multer({ dest: "uploads/" })

export default (app) => {
  app.use("/uploads", route)

  route.post(
    "/",
    upload.array("files"),
    middlewares.wrap(require("./create-upload").default)
  )

  route.delete(
    "/",
    transformBody(AdminDeleteUploadReq),
    middlewares.wrap(require("./delete-upload").default)
  )

  route.post(
    "/download-url",
    transformBody(AdminCreateUploadsFileDownloadUrlReq),
    middlewares.wrap(require("./get-download-url").default)
  )

  return app
}

export type AdminUploadRes = {
  uploads: { url: string }[]
}

export type AdminDeleteUploadRes = DeleteResponse

export type AdminCreateUploadsFileDownloadUrlRes = {
  download_url: string
}

export * from "./create-upload"
export * from "./delete-upload"
export * from "./get-download-url"
