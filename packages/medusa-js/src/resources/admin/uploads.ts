import {
  AdminUploadRes,
  AdminDeleteUploadRes,
  IAdminPostUploadsFile,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"
import FormData from "form-data"

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

  delete(file: IAdminPostUploadsFile): ResponsePromise<AdminDeleteUploadRes> {
    const path = `/admin/uploads`

    const payload = new FormData()
    payload.append("file", file)

    return this.client.request("DELETE", path)
  }
}

export default AdminUploadsResource
