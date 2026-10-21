import { NoteDTO, NoteResourceType } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export interface AdminCreateNote {
  resource_type: NoteResourceType
  resource_id: string
  value: string
}

export interface AdminNoteResponse {
  note: NoteDTO
}

export interface AdminNoteListParams {
  resource_type?: string
  resource_id?: string | string[]
  limit?: number
  offset?: number
  fields?: string
}

export interface AdminNoteListResponse {
  notes: NoteDTO[]
  count: number
  offset: number
  limit: number
}

export interface AdminNoteDeleteResponse {
  id: string
  object: "note"
  deleted: boolean
}

export class Notes {
  /**
   * @ignore
   */
  private client: Client
  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  /**
   * This method creates a note. It sends a request to the
   * [Create Note](https://docs.medusajs.com/api/admin/notes/create-note)
   * API route.
   *
   * @param body - The details of the note.
   * @param query - Configure the fields to retrieve in the note.
   * @param headers - Headers to pass in the request
   * @returns The note's details.
   *
   * @example
   * sdk.admin.notes.create({
   *   resource_type: "order",
   *   resource_id: "order_123",
   *   value: "This order needs a follow-up",
   * })
   * .then(({ note }) => {
   *   console.log(note)
   * })
   */
  async create(
    body: AdminCreateNote,
    query?: Record<string, any>,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<AdminNoteResponse>(`/admin/notes`, {
      method: "POST",
      headers,
      body,
      query,
    })
  }

  /**
   * This method retrieves a paginated list of notes. It sends a request to the
   * [List Notes](https://docs.medusajs.com/api/admin/notes/list-notes) API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of notes.
   *
   * @example
   * To retrieve the list of notes for a resource:
   *
   * ```ts
   * sdk.admin.notes.list({
   *   resource_type: "order",
   *   resource_id: "order_123",
   * })
   * .then(({ notes, count, limit, offset }) => {
   *   console.log(notes)
   * })
   * ```
   *
   * To retrieve notes for multiple resources, pass an array as `resource_id`:
   *
   * ```ts
   * sdk.admin.notes.list({
   *   resource_type: "order",
   *   resource_id: ["order_123", "order_321"],
   * })
   * .then(({ notes, count, limit, offset }) => {
   *   console.log(notes)
   * })
   * ```
   */
  async list(query?: AdminNoteListParams, headers?: ClientHeaders) {
    return this.client.fetch<AdminNoteListResponse>(`/admin/notes`, {
      headers,
      query,
    })
  }

  /**
   * This method deletes a note by its ID. It sends a request to the
   * [Delete Note](https://docs.medusajs.com/api/admin/notes/delete-a-note)
   * API route.
   *
   * @param id - The note's ID.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.notes.delete("note_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<AdminNoteDeleteResponse>(`/admin/notes/${id}`, {
      method: "DELETE",
      headers,
    })
  }
}
