import {
  AdminCreateNote,
  AdminNoteDeleteResponse,
  AdminNoteListParams,
  AdminNoteListResponse,
  AdminNoteResponse,
  FetchError,
} from "@medusajs/js-sdk"
import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const NOTES_QUERY_KEY = "notes" as const
export const notesQueryKeys = queryKeysFactory(NOTES_QUERY_KEY)

export const useNotes = (
  query?: AdminNoteListParams,
  options?: Omit<
    UseQueryOptions<
      AdminNoteListResponse,
      FetchError,
      AdminNoteListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.notes.list(query),
    queryKey: notesQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateNote = (
  options?: UseMutationOptions<AdminNoteResponse, FetchError, AdminCreateNote>
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.notes.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: notesQueryKeys.lists() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteNote = (
  id: string,
  options?: UseMutationOptions<AdminNoteDeleteResponse, FetchError, void>
) => {
  return useMutation({
    mutationFn: () => sdk.admin.notes.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: notesQueryKeys.lists() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
