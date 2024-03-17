import {
  AdminGetNotesParams,
  AdminNotesListRes,
  AdminNotesRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_NOTE_QUERY_KEY = `admin_notes` as const

export const adminNoteKeys = queryKeysFactory(ADMIN_NOTE_QUERY_KEY)

type NoteQueryKeys = typeof adminNoteKeys

/**
 * This hook retrieves a list of notes. The notes can be filtered by fields such as `resource_id` passed in
 * the `query` parameter. The notes can also be paginated.
 *
 * @example
 * To list notes:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminNotes } from "medusa-react"
 *
 * const Notes = () => {
 *   const { notes, isLoading } = useAdminNotes()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {notes && !notes.length && <span>No Notes</span>}
 *       {notes && notes.length > 0 && (
 *         <ul>
 *           {notes.map((note) => (
 *             <li key={note.id}>{note.resource_type}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Notes
 * ```
 *
 * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminNotes } from "medusa-react"
 *
 * const Notes = () => {
 *   const {
 *     notes,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminNotes({
 *     limit: 40,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {notes && !notes.length && <span>No Notes</span>}
 *       {notes && notes.length > 0 && (
 *         <ul>
 *           {notes.map((note) => (
 *             <li key={note.id}>{note.resource_type}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Notes
 * ```
 *
 * @customNamespace Hooks.Admin.Notes
 * @category Queries
 */
export const useAdminNotes = (
  /**
   * Filters and pagination configurations applied on retrieved notes.
   */
  query?: AdminGetNotesParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminNotesListRes>,
    Error,
    ReturnType<NoteQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminNoteKeys.list(query),
    queryFn: () => client.admin.notes.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a note's details.
 *
 * @example
 * import React from "react"
 * import { useAdminNote } from "medusa-react"
 *
 * type Props = {
 *   noteId: string
 * }
 *
 * const Note = ({ noteId }: Props) => {
 *   const { note, isLoading } = useAdminNote(noteId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {note && <span>{note.resource_type}</span>}
 *     </div>
 *   )
 * }
 *
 * export default Note
 *
 * @customNamespace Hooks.Admin.Notes
 * @category Queries
 */
export const useAdminNote = (
  /**
   * The note's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminNotesRes>,
    Error,
    ReturnType<NoteQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminNoteKeys.detail(id),
    queryFn: () => client.admin.notes.retrieve(id),
    ...options,
  })
  return { ...data, ...rest } as const
}
