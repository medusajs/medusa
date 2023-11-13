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

/**
 * This class is used to send requests to [Admin Note API Routes](https://docs.medusajs.com/api/admin#notes). All its method
 * are available in the JS Client under the `medusa.admin.notes` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * Notes are created by admins and can be associated with any resource. For example, an admin can add a note to an order for additional details or remarks.
 */
class AdminNotesResource extends BaseResource {
  /**
   * Create a Note which can be associated with any resource.
   * @param {AdminPostNotesReq} payload - The note to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminNotesRes>} Resolves to the note's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.notes.create({
   *   resource_id,
   *   resource_type: "order",
   *   value: "We delivered this order"
   * })
   * .then(({ note }) => {
   *   console.log(note.id);
   * })
   */
  create(
    payload: AdminPostNotesReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminNotesRes> {
    const path = `/admin/notes`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update a Note's details.
   * @param {string} id - The note's ID.
   * @param {AdminPostNotesNoteReq} payload - The attributes to update in the note.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminNotesRes>} Resolves to the note's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.notes.update(noteId, {
   *  value: "We delivered this order"
   * })
   * .then(({ note }) => {
   *   console.log(note.id);
   * })
   */
  update(
    id: string,
    payload: AdminPostNotesNoteReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminNotesRes> {
    const path = `/admin/notes/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a Note.
   * @param {string} id - The note's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminNotesDeleteRes>} Resolves to the deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.notes.delete(noteId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id);
   * })
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminNotesDeleteRes> {
    const path = `/admin/notes/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a note's details.
   * @param {string} id - The note's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminNotesRes>} Resolves to the note's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.notes.retrieve(noteId)
   * .then(({ note }) => {
   *   console.log(note.id);
   * })
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminNotesRes> {
    const path = `/admin/notes/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of notes. The notes can be filtered by fields such as `resource_id` passed in the `query` parameter. The notes can also be paginated.
   * @param {AdminGetNotesParams} query - Filters and pagination configurations applied on retrieved notes.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminNotesListRes>} Resolves to the list of notes with pagination fields.
   * 
   * @example
   * To list notes:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.notes.list()
   * .then(({ notes, limit, offset, count }) => {
   *   console.log(notes.length);
   * })
   * ```
   * 
   * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.notes.list({
   *   limit,
   *   offset
   * })
   * .then(({ notes, limit, offset, count }) => {
   *   console.log(notes.length);
   * })
   * ```
   */
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
