import { Router } from "express"
import multer from "multer"
import { DeleteResponse } from "../../../../types/common"

import middlewares, { transformBody } from "../../../middlewares"
import { AdminDeleteUploadsReq } from "./delete-upload"
import { AdminPostUploadsDownloadUrlReq } from "./get-download-url"

const route = Router()
const upload = multer({ dest: "uploads/" })

export default (app) => {
  app.use("/uploads", route)

  route.post(
    "/",
    upload.array("files"),
    middlewares.wrap(require("./create-upload").default)
  )

  route.post(
    "/protected",
    upload.array("files"),
    middlewares.wrap(require("./create-protected-upload").default)
  )

  route.delete(
    "/",
    transformBody(AdminDeleteUploadsReq),
    middlewares.wrap(require("./delete-upload").default)
  )

  route.post(
    "/download-url",
    transformBody(AdminPostUploadsDownloadUrlReq),
    middlewares.wrap(require("./get-download-url").default)
  )

  return app
}

/**
 * @schema AdminUploadsRes
 * type: object
 * required:
 *   - uploads
 * properties:
 *   uploads:
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - url
 *       properties:
 *         url:
 *           description: The URL of the uploaded file.
 *           type: string
 *           format: uri
 */
export type AdminUploadsRes = {
  uploads: { url: string }[]
}

/**
 * @schema AdminDeleteUploadsRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     description: The file key of the upload deleted
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: file
 *   deleted:
 *     type: boolean
 *     description: Whether or not the items were deleted.
 *     default: true
 */
export type AdminDeleteUploadsRes = DeleteResponse

/**
 * @schema AdminUploadsDownloadUrlRes
 * type: object
 * required:
 *   - download_url
 * properties:
 *   download_url:
 *     description: The Download URL of the file
 *     type: string
 */
export type AdminUploadsDownloadUrlRes = {
  download_url: string
}

export * from "./create-upload"
export * from "./delete-upload"
export * from "./get-download-url"
