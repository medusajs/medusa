import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { TagsListRes, TagRes } from "../../types/api-responses"

const TAGS_QUERY_KEY = "tags" as const
export const tagsQueryKeys = queryKeysFactory(TAGS_QUERY_KEY)

export const useTag = (
  id: string,
  options?: Omit<
    UseQueryOptions<TagRes, Error, TagRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: tagsQueryKeys.detail(id),
    queryFn: async () => client.tags.retrieve(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useTags = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<TagsListRes, Error, TagsListRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: tagsQueryKeys.list(query),
    queryFn: async () => client.tags.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
