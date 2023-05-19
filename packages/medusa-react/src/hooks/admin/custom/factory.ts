import { Response } from "@medusajs/medusa-js"
import { QueryKey, UseMutationOptions } from "@tanstack/react-query"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"
import {
  RelatedDomains,
  useAdminCreateCustomEntity,
  useAdminDeleteCustomEntity,
  useAdminUpdateCustomEntity,
} from "./mutations"
import { useAdminCustomEntities, useAdminCustomEntity } from "./queries"

export const createCustomAdminHooks = (
  /**
   * @description path to the custom endpoint (without the `/admin` prefix)
   * @example "restock-notifications"
   */
  path: string,
  /**
   * @description query key to use for the custom endpoint
   * @example "admin_restock_notifications"
   */
  queryKey: string,
  /**
   * @description optional related domains to invalidate on mutations
   * @default undefined
   * @example { products: true }
   */
  relatedDomains?: RelatedDomains
) => {
  const customQueryKeys = queryKeysFactory(queryKey)

  const useAdminEntity = <TResponse>(
    id: string,
    options?: UseQueryOptionsWrapper<Response<TResponse>, Error, QueryKey>
  ) => useAdminCustomEntity(path, id, customQueryKeys.detail(id), options)

  const useAdminEntities = <TQuery extends Record<string, any>, TResponse>(
    query?: TQuery,
    options?: UseQueryOptionsWrapper<Response<TResponse>, Error, QueryKey>
  ) => useAdminCustomEntities(path, customQueryKeys.list(query), query, options)

  const useAdminCreateMutation = <
    TPayload extends Record<string, any>,
    TResponse
  >(
    options?: UseMutationOptions<Response<TResponse>, Error, TPayload>
  ) =>
    useAdminCreateCustomEntity(
      path,
      customQueryKeys.list(),
      options,
      relatedDomains
    )

  const useAdminUpdateMutation = <
    TPayload extends Record<string, any>,
    TResponse
  >(
    id: string,
    options?: UseMutationOptions<Response<TResponse>, Error, TPayload>
  ) =>
    useAdminUpdateCustomEntity(
      path,
      id,
      [customQueryKeys.list(), customQueryKeys.detail(id)],
      options,
      relatedDomains
    )

  const useAdminDeleteMutation = <TResponse>(
    id: string,
    options?: UseMutationOptions<Response<TResponse>, Error, void>
  ) =>
    useAdminDeleteCustomEntity(
      path,
      id,
      [customQueryKeys.lists(), customQueryKeys.detail(id)],
      options
    )

  return {
    useAdminEntity,
    useAdminEntities,
    useAdminCreateMutation,
    useAdminUpdateMutation,
    useAdminDeleteMutation,
  }
}
