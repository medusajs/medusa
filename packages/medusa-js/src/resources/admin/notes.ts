import {
  AdminGetNotesParams,
  AdminNotesDeleteRes,
  AdminNotesListRes,
  AdminNotesRes,
  AdminPostNotesNoteReq,
  AdminPostNotesReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminNotesResource extends BaseResource {
  create(payload: AdminPostNotesReq): ResponsePromise<AdminNotesRes> {
    const path = `/admin/notes`
    return this.client.request("POST", path, payload)
  }

  update(
    id: string,
    payload: AdminPostNotesNoteReq
  ): ResponsePromise<AdminNotesRes> {
    const path = `/admin/notes/${id}`
    return this.client.request("POST", path, payload)
  }

  delete(id: string): ResponsePromise<AdminNotesDeleteRes> {
    const path = `/admin/notes/${id}`
    return this.client.request("DELETE", path)
  }

  retrieve(id: string): ResponsePromise<AdminNotesRes> {
    const path = `/admin/notes/${id}`
    return this.client.request("GET", path)
  }

  list(query: AdminGetNotesParams): ResponsePromise<AdminNotesListRes> {
    let path = `/admin/notes/`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return `${key}=${value}`
      })

      path = `/admin/notes?${queryString.join("&")}`
    }

    return this.client.request("GET", path)
  }
}

export default AdminNotesResource
