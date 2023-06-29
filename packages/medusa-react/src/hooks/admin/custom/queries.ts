import { Response } from "@medusajs/medusa-js"
import { QueryKey, useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"

export const useAdminCustomQuery = <
  TQuery extends Record<string, any>,
  TResponse
>(
  path: string,
  queryKey: QueryKey,
  query?: TQuery,
  options?: UseQueryOptionsWrapper<
    Response<TResponse>,
    Error,
    (string | TQuery | QueryKey | undefined)[]
  >
) => {
  const { client } = useMedusa()

  return useQuery(
    [path, query, queryKey],
    () => client.admin.custom.get<TQuery, TResponse>(path, query),
    options
  )
}
