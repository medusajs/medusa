import {
  AdminDeleteUploadReq,
  AdminDeleteUploadRes,
  AdminCreateUploadsFileDownloadUrlReq,
  AdminCreateUploadsFileDownloadUrlRes,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminUploadsResource extends BaseResource {
  private headers = {
    "Content-Type": "multipart/form-data",
  }

  create(file: IAdminPostUploadsFile): ResponsePromise<AdminUploadRes> {
    const path = `/admin/uploads`

    const payload = new FormData()
    payload.append("files", file)

    return this.client.request("POST", path, payload, {}, this.headers)
  }

  delete(
    payload: AdminDeleteUploadReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDeleteUploadRes> {
    const path = `/admin/uploads`

    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }

  getPresignedDownloadUrl(
    payload: AdminCreateUploadsFileDownloadUrlReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCreateUploadsFileDownloadUrlRes> {
    const path = `/admin/uploads/download-url`

    return this.client.request("POST", path, payload, {}, customHeaders)
  }
}

export default AdminUploadsResource
