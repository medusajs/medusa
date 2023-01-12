import {
  AdminDeleteUploadsReq,
  AdminDeleteUploadsRes,
  AdminPostUploadsDownloadUrlReq,
  AdminUploadsDownloadUrlRes,
  AdminUploadsRes,
  IAdminPostUploadsFileReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminUploadsResource extends BaseResource {
  private headers = {
    "Content-Type": "multipart/form-data",
  }

  create(file: IAdminPostUploadsFileReq): ResponsePromise<AdminUploadsRes> {
    const path = `/admin/uploads`

    const payload = new FormData()
    payload.append(file.originalName, file.path)

    return this.client.request("POST", path, payload, {}, this.headers)
  }

  createProtected(
    file: IAdminPostUploadsFileReq
  ): ResponsePromise<AdminUploadsRes> {
    const path = `/admin/uploads/protected`

    const payload = new FormData()
    payload.append(file.originalName, file.path)

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
}

export default AdminUploadsResource
