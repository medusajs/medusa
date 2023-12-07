import { Router } from "express"
import multer from "multer"
import { DeleteResponse } from "../../../../types/common"

import middlewares, { transformBody } from "../../../middlewares"
import { AdminDeleteUploadsReq } from "./delete-upload"
import { AdminPostUploadsDownloadUrlReq } from "./get-download-url"
import { FileServiceUploadResult } from "@medusajs/types"

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
 * description: "The list of uploaded files."
 * required:
 *   - uploads
 * properties:
 *   uploads:
 *     type: array
 *     description: "Uploaded files details."
 *     items:
 *       type: object
 *       required:
 *         - url
 *         - key
 *       properties:
 *         url:
 *           description: The URL of the uploaded file.
 *           type: string
 *           format: uri
 *         key:
 *           description: The key of the file that is identifiable by the file service. It can be used later to retrieve or manipulate the file.
 *           type: string
 */
export type AdminUploadsRes = {
  uploads: FileServiceUploadResult[]
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
 * description: "The download URL details."
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
