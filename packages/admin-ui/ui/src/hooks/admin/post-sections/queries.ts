import { PostSection } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { useQuery } from "react-query"
import { buildQueryFromObject } from "../../../services/api"
import medusaRequest from "../../../services/request"
import { queryKeysFactory } from "../../utils"

const POST_SECTION_QUERY_KEY = `post_section` as const

export const postSectionKeys = queryKeysFactory(POST_SECTION_QUERY_KEY)

type PostSectionQueryKeys = typeof postSectionKeys

export const useGetPostSections = (
  filters?: any,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ post_sections: PostSection[]; count: number }>,
    Error,
    ReturnType<PostSectionQueryKeys["list"]>
  >
) => {
  const queryString = filters ? `/?${buildQueryFromObject(filters)}` : ``
  const path = `/admin/post-sections${queryString}`

  const { data, refetch, ...rest } = useQuery(
    postSectionKeys.list({ filters }),
    () =>
      medusaRequest<Response<{ post_sections: PostSection[]; count: number }>>(
        "GET",
        path
      ),
    options
  )

  return { ...data?.data, ...rest, refetch }
}

export const useGetPostSection = (
  id: string,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ post_section: PostSection }>,
    Error,
    ReturnType<PostSectionQueryKeys["detail"]>
  >
) => {
  const path = `/admin/post-sections/${id}`

  const { data, refetch, ...rest } = useQuery(
    postSectionKeys.detail(id),
    () => medusaRequest<Response<{ post_section: PostSection }>>("GET", path),
    options
  )

  return { ...data?.data, ...rest, refetch }
}
