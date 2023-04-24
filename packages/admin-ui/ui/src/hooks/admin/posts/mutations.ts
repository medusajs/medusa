import { OutputData } from "@editorjs/editorjs"
import { Post, PostTag } from "@medusajs/medusa"
import { useMutation, useQueryClient } from "react-query"
import medusaRequest from "../../../services/request"
import { buildOptions } from "../../utils/buildOptions"
import { postKeys, postTagKeys } from "./queries"

export interface AdminBasePostReq {
  status?: Post["status"]
  featured_image_id?: string | null
  featured_image?: string | null
  title?: string
  excerpt?: string
  content?: OutputData
  content_mode?: "basic" | "advanced"
  section_ids?: string[]
  tag_ids?: string[]
  author_ids?: string[]
  handle?: string
  is_home_page?: boolean
  product_id?: string
}

export interface AdminCreatePostReq extends AdminBasePostReq {}

export interface AdminUpdatePostReq extends AdminBasePostReq {}

export interface AdminDuplicatePostReq
  extends Omit<AdminBasePostReq, "status" | "section_ids"> {
  status?: Post["status"]
  type?: Post["type"]
}

export interface AdminCreatePostTagReq {
  label: string
  handle: string
}

export const useAdminCreatePost = (type: Post["type"], options?) => {
  const path = `/admin/posts/`

  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminCreatePostReq) =>
      medusaRequest<{ post: Post }>("POST", path, { ...payload, type }),
    buildOptions(
      queryClient,
      [postKeys.list({ type }), postKeys.details()],
      options
    )
  )
}

export const useAdminUpdatePost = (
  id: string,
  type: Post["type"],
  options?
) => {
  const path = `/admin/posts/${id}`

  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminUpdatePostReq) =>
      medusaRequest<{ post: Post }>("PUT", path, { ...payload, type }),
    buildOptions(
      queryClient,
      [postKeys.list({ type }), postKeys.details(), postKeys.detail(id)],
      options
    )
  )
}

export const useAdminDuplicatePost = (
  id: string,
  type: Post["type"],
  options?
) => {
  const path = `/admin/posts/${id}/duplicate`

  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminDuplicatePostReq) =>
      medusaRequest<{ post: Post }>("POST", path, payload),
    buildOptions(
      queryClient,
      [postKeys.list({ type }), postKeys.details(), postKeys.detail(id)],
      options
    )
  )
}

export const useAdminUpdatePostWithoutRefetch = (id: string) => {
  const path = `/admin/posts/${id}`

  return useMutation((payload: AdminUpdatePostReq) =>
    medusaRequest<{ post: Post }>("PUT", path, payload)
  )
}

export const useAdminDeletePost = (
  id: string,
  type: Post["type"],
  options?
) => {
  const path = `/admin/posts/${id}`

  const queryClient = useQueryClient()

  return useMutation(
    () => medusaRequest("DELETE", path),
    buildOptions(
      queryClient,
      [postKeys.list({ type }), postKeys.details(), postKeys.detail(id)],
      options
    )
  )
}

export const useAdminCreatePostTag = (options?) => {
  const path = `/admin/post-tags/`

  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminCreatePostTagReq) =>
      medusaRequest<{ post_tag: PostTag }>("POST", path, payload),
    buildOptions(queryClient, [postTagKeys.list()], options)
  )
}
