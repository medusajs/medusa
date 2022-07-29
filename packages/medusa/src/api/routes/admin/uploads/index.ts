import { Router } from "express"
import multer from "multer"
import { DeleteResponse } from "../../../../types/common"

import { transformBody } from "../../../middlewares"
import { AdminDeleteUploadsReq } from "./delete-upload"
import { AdminPostUploadsDownloadUrlReq } from "./get-download-url"

const route = Router()
const upload = multer({ dest: "uploads/" })

export default (app) => {
  app.use("/uploads", route)

  route.post("/", upload.array("files"), require("./create-upload").default)

  route.delete(
    "/",
    transformBody(AdminDeleteUploadsReq),
    require("./delete-upload").default
  )

  route.post(
    "/download-url",
    transformBody(AdminPostUploadsDownloadUrlReq),
    require("./get-download-url").default
  )

  return app
}

export type AdminUploadsRes = {
  uploads: { url: string }[]
}

export type AdminDeleteUploadsRes = DeleteResponse

export type AdminUploadsDownloadUrlRes = {
  download_url: string
}

export * from "./create-upload"
export * from "./delete-upload"
export * from "./get-download-url"
