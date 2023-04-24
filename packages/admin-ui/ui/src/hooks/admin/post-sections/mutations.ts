import { PostSection } from "@medusajs/medusa"
import { useMutation, useQueryClient } from "react-query"
import medusaRequest from "../../../services/request"
import { buildOptions } from "../../utils/buildOptions"
import { postSectionKeys } from "./queries"

export interface AdminBasePostSectionReq {
  name?: string
  is_reusable?: boolean
}

export interface AdminCreatePostSectionReq extends AdminBasePostSectionReq {
  type: PostSection["type"]
  status: PostSection["status"]
  content: Record<string, any>
  settings: Record<string, any>
}

export interface AdminUpdatePostSectionReq extends AdminBasePostSectionReq {
  type: PostSection["type"]
  status?: PostSection["status"]
  content?: Record<string, any>
  settings?: Record<string, any>
}

export interface AdminDuplicatePostSectionReq
  extends Omit<AdminBasePostSectionReq, "type"> {
  type: PostSection["type"]
  status?: PostSection["status"]
}

export const useAdminCreatePostSection = (options?) => {
  const path = `/admin/post-sections/`

  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminCreatePostSectionReq) =>
      medusaRequest<{ post_section: PostSection }>("POST", path, payload),
    buildOptions(queryClient, [postSectionKeys.list()], options)
  )
}

export const useAdminUpdatePostSection = (id: string, options?) => {
  const path = `/admin/post-sections/${id}`

  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminUpdatePostSectionReq) =>
      medusaRequest<{ post_section: PostSection }>("PUT", path, payload),
    buildOptions(
      queryClient,
      [postSectionKeys.list(), postSectionKeys.detail(id)],
      options
    )
  )
}

export const useAdminDuplicatePostSection = (id: string, options?) => {
  const path = `/admin/post-sections/${id}/duplicate`

  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminDuplicatePostSectionReq) =>
      medusaRequest<{ post_section: PostSection }>("POST", path, payload),
    buildOptions(queryClient, [postSectionKeys.list()], options)
  )
}

export const useAdminDeletePostSection = (id: string, options?) => {
  const path = `/admin/post-sections/${id}`

  const queryClient = useQueryClient()

  return useMutation(
    () => medusaRequest("DELETE", path),
    buildOptions(
      queryClient,
      [postSectionKeys.list(), postSectionKeys.detail(id)],
      options
    )
  )
}
