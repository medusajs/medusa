import {
  AdminDeleteUploadsReq,
  AdminDeleteUploadsRes,
  AdminPostUploadsDownloadUrlReq,
  AdminUploadsDownloadUrlRes,
  AdminUploadsRes,
} from "@medusajs/medusa"
import { AdminCreateUploadPayload, ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminUploadsResource extends BaseResource {
  private headers = {
    "Content-Type": "multipart/form-data",
  }

  /**
   * @description Uploads at least one file to the specific fileservice that is installed in Medusa.
   * @param file File or array of files to upload.
   * @returns Uploaded file or files.
   */
  create(file: AdminCreateUploadPayload): ResponsePromise<AdminUploadsRes> {
    const path = `/admin/uploads`

    const payload = this._createPayload(file)

    return this.client.request("POST", path, payload, {}, this.headers)
  }

  /**
   * @description Uploads at least one file with ACL or a non-public bucket to the specific fileservice that is installed in Medusa.
   * @param file File or array of files to upload.
   * @returns Uploaded file or files.
   */
  createProtected(
    file: AdminCreateUploadPayload
  ): ResponsePromise<AdminUploadsRes> {
    const path = `/admin/uploads/protected`

    const payload = this._createPayload(file)

    return this.client.request("POST", path, payload, {}, this.headers)
  }

  delete(
    payload: AdminDeleteUploadsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDeleteUploadsRes> {
    const path = `/admin/uploads`

    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }

  getPresignedDownloadUrl(
    payload: AdminPostUploadsDownloadUrlReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminUploadsDownloadUrlRes> {
    const path = `/admin/uploads/download-url`

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  private _createPayload(file: AdminCreateUploadPayload) {
    const payload = new FormData()

    if (Array.isArray(file)) {
      file.forEach((f) => payload.append("files", f))
    } else {
      payload.append("files", file)
    }

    return payload
  }
}

export default AdminUploadsResource
