import {
  AdminNotesDeleteRes,
  AdminNotesRes,
  AdminPostNotesNoteReq,
  AdminPostNotesReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminNoteKeys } from "./queries"

/**
 * This hook creates a Note which can be associated with any resource.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateNote } from "medusa-react"
 *
 * const CreateNote = () => {
 *   const createNote = useAdminCreateNote()
 *   // ...
 *
 *   const handleCreate = () => {
 *     createNote.mutate({
 *       resource_id: "order_123",
 *       resource_type: "order",
 *       value: "We delivered this order"
 *     }, {
 *       onSuccess: ({ note }) => {
 *         console.log(note.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateNote
 *
 * @customNamespace Hooks.Admin.Notes
 * @category Mutations
 */
export const useAdminCreateNote = (
  options?: UseMutationOptions<
    Response<AdminNotesRes>,
    Error,
    AdminPostNotesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostNotesReq) =>
      client.admin.notes.create(payload),
    ...buildOptions(queryClient, adminNoteKeys.lists(), options),
  })
}

/**
 * This hook updates a Note's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateNote } from "medusa-react"
 *
 * type Props = {
 *   noteId: string
 * }
 *
 * const Note = ({ noteId }: Props) => {
 *   const updateNote = useAdminUpdateNote(noteId)
 *   // ...
 *
 *   const handleUpdate = (
 *     value: string
 *   ) => {
 *     updateNote.mutate({
 *       value
 *     }, {
 *       onSuccess: ({ note }) => {
 *         console.log(note.value)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Note
 *
 * @customNamespace Hooks.Admin.Notes
 * @category Mutations
 */
export const useAdminUpdateNote = (
  /**
   * The note's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminNotesRes>,
    Error,
    AdminPostNotesNoteReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostNotesNoteReq) =>
      client.admin.notes.update(id, payload),
    ...buildOptions(
      queryClient,
      [adminNoteKeys.detail(id), adminNoteKeys.lists()],
      options
    ),
  })
}

/**
 * This hook deletes a Note.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteNote } from "medusa-react"
 *
 * type Props = {
 *   noteId: string
 * }
 *
 * const Note = ({ noteId }: Props) => {
 *   const deleteNote = useAdminDeleteNote(noteId)
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteNote.mutate()
 *   }
 *
 *   // ...
 * }
 *
 * export default Note
 *
 * @customNamespace Hooks.Admin.Notes
 * @category Mutations
 */
export const useAdminDeleteNote = (
  /**
   * The note's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminNotesDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.notes.delete(id),
    ...buildOptions(
      queryClient,
      [adminNoteKeys.detail(id), adminNoteKeys.lists()],
      options
    ),
  })
}
