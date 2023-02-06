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

export const useAdminCreateNote = (
  options?: UseMutationOptions<
    Response<AdminNotesRes>,
    Error,
    AdminPostNotesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostNotesReq) => client.admin.notes.create(payload),
    buildOptions(queryClient, adminNoteKeys.lists(), options)
  )
}

export const useAdminUpdateNote = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminNotesRes>,
    Error,
    AdminPostNotesNoteReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostNotesNoteReq) => client.admin.notes.update(id, payload),
    buildOptions(
      queryClient,
      [adminNoteKeys.detail(id), adminNoteKeys.lists()],
      options
    )
  )
}

export const useAdminDeleteNote = (
  id: string,
  options?: UseMutationOptions<Response<AdminNotesDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.notes.delete(id),
    buildOptions(
      queryClient,
      [adminNoteKeys.detail(id), adminNoteKeys.lists()],
      options
    )
  )
}
