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
  create(
    payload: AdminPostNotesReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminNotesRes> {
    const path = `/admin/notes`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  update(
    id: string,
    payload: AdminPostNotesNoteReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminNotesRes> {
    const path = `/admin/notes/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminNotesDeleteRes> {
    const path = `/admin/notes/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminNotesRes> {
    const path = `/admin/notes/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  list(
    query?: AdminGetNotesParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminNotesListRes> {
    let path = `/admin/notes/`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/notes?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminNotesResource
