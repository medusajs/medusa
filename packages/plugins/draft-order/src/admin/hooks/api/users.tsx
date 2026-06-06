import { FetchError } from "@zjedene-medusa/js-sdk"
import { HttpTypes } from "@zjedene-medusa/types"
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"

import { sdk } from "../../lib/queries/sdk"

const USER_QUERY_KEY = "users"

export const usersQueryKeys = {
  list: (query?: Record<string, any>) => [
    USER_QUERY_KEY,
    query ? query : undefined,
  ],
  detail: (id: string, query?: Record<string, any>) => [
    USER_QUERY_KEY,
    id,
    query ? query : undefined,
  ],
}

export const useUser = (
  id: string,
  query?: HttpTypes.SelectParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminUserResponse,
      FetchError,
      HttpTypes.AdminUserResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: usersQueryKeys.detail(id, query),
    queryFn: async () => sdk.admin.user.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}
