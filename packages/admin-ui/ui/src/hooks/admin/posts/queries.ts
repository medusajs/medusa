import { Post, PostTag } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { useQuery } from "react-query"
import medusaRequest from "../../../services/request"
import { queryKeysFactory } from "../../utils"

const POST_QUERY_KEY = `post,count` as const
const POST_TAG_QUERY_KEY = `post_tag,count` as const

export const postKeys = queryKeysFactory(POST_QUERY_KEY)
export const postTagKeys = queryKeysFactory(POST_TAG_QUERY_KEY)

type PostQueryKeys = typeof postKeys
type PostTagQueryKeys = typeof postTagKeys

export const useGetPosts = (
  type: string,
  filters?: any,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ posts: Post[]; count: number }>,
    Error,
    ReturnType<PostQueryKeys["list"]>
  >
) => {
  const queryString = filters
    ? `${new URLSearchParams(filters).toString()}`
    : ``
  const path = `/admin/posts/?type=${type}&${queryString}`

  const { data, refetch, ...rest } = useQuery(
    postKeys.list({ type, filters }),
    () =>
      medusaRequest<Response<{ posts: Post[]; count: number }>>("GET", path),
    options
  )

  return { ...data?.data, ...rest, refetch }
}

export const useGetPost = (
  id: string,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ post: Post }>,
    Error,
    ReturnType<PostQueryKeys["detail"]>
  >
) => {
  const path = `/admin/posts/${id}`

  const { data, ...rest } = useQuery(
    postKeys.detail(id),
    () => medusaRequest<Response<{ post: Post }>>("GET", path),
    options
  )

  return { ...data?.data, ...rest }
}

export const useGetHomePage = () => {
  const { posts, ...rest } = useGetPosts(
    "page",
    {
      status: "published",
      handle: "",
    },
    {
      queryKeyHashFn: () => "home-page",
    }
  )

  return { post: posts?.[0], ...rest }
}

export const useGetPostTags = (
  filters?: Record<string, string>,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ post_tags: PostTag[] }>,
    Error,
    ReturnType<PostTagQueryKeys["list"]>
  >
) => {
  const queryString = filters
    ? `?${new URLSearchParams(filters).toString()}`
    : ``
  const path = `/admin/post-tags${queryString}`

  const { data, refetch, ...rest } = useQuery(
    postTagKeys.list(),
    () =>
      medusaRequest<Response<{ post_tags: PostTag[]; count: number }>>(
        "GET",
        path
      ),
    options
  )

  return { ...data?.data, ...rest, refetch }
}
