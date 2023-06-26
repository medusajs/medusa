import Medusa, { AdminCustomResource, Response } from "@medusajs/medusa-js"
import { QueryKey, useQuery, UseQueryResult } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"

export const useAdminCustomEntity = <TRes>(
  path: string,
  id: string,
  queryKey: QueryKey,
  options?: UseQueryOptionsWrapper<Response<TRes>, Error, QueryKey>
): UseQueryResult<Response<TRes>, Error> => {
  const { client } = useMedusa()

  const result = useQuery(
    queryKey,
    () => client.admin.custom.retrieve<TRes>(path, id),
    options
  )

  return result
}

export const useAdminCustomEntities = <
  TQuery extends Record<string, any>,
  TRes
>(
  path: string,
  queryKey: QueryKey,
  query?: TQuery,
  options?: UseQueryOptionsWrapper<Response<TRes>, Error, QueryKey>
): UseQueryResult<Response<TRes>, Error> => {
  const { client } = useMedusa()

  return useQuery(
    queryKey,
    () => client.admin.custom.list<TQuery, TRes>(path, query),
    options
  )
}

interface CustomResponse extends Record<string, any> {}
interface CustomQuery extends Record<string, any> {}

type CustomGetProps = Parameters<AdminCustomResource["get"]>

export const useAdminCustomGet = <TResponse extends CustomResponse>(
  queryFn: (client: Medusa) => Promise<Response<TResponse>>,
  queryKey: QueryKey,
  options?: UseQueryOptionsWrapper<Response<TResponse>, Error, QueryKey>
) => {
  const { client } = useMedusa()

  client.admin.custom.get
}
