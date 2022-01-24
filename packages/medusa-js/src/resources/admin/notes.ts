import {
  AdminGetNotesParams,
  AdminNotesDeleteRes,
  AdminNotesListRes,
  AdminNotesRes,
  AdminPostNotesNoteReq,
  AdminPostNotesReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminNotesResource extends BaseResource {
  create(payload: AdminPostNotesReq, customHeaders: object = {}): ResponsePromise<AdminNotesRes> {
    const path = `/admin/notes`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  update(
    id: string,
    payload: AdminPostNotesNoteReq,
    customHeaders: object = {}): ResponsePromise<AdminNotesRes> {
    const path = `/admin/notes/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  delete(id: string, customHeaders: object = {}): ResponsePromise<AdminNotesDeleteRes> {
    const path = `/admin/notes/${id}`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }

  retrieve(id: string, customHeaders: object = {}): ResponsePromise<AdminNotesRes> {
    const path = `/admin/notes/${id}`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  list(query?: AdminGetNotesParams, customHeaders: object = {}): ResponsePromise<AdminNotesListRes> {
    let path = `/admin/notes/`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/notes?${queryString}`
    }

    return this.client.request("GET", path, {}, {}, customHeaders)
  }
}

export default AdminNotesResource
