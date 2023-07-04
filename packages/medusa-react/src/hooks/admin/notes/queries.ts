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

export const useAdminNotes = (
  query?: AdminGetNotesParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminNotesListRes>,
    Error,
    ReturnType<NoteQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminNoteKeys.list(query),
    () => client.admin.notes.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminNote = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminNotesRes>,
    Error,
    ReturnType<NoteQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminNoteKeys.detail(id),
    () => client.admin.notes.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}
