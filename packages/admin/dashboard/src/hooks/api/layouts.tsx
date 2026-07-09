import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"

import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory, TQueryKey } from "../../lib/query-key-factory"

const LAYOUTS_QUERY_KEY = "layouts" as const
const _layoutsKeys = queryKeysFactory(
  LAYOUTS_QUERY_KEY
) as TQueryKey<"layouts"> & {
  configuration: (zone: string) => QueryKey
  configurations: (
    query?: HttpTypes.AdminGetLayoutConfigurationsParams
  ) => QueryKey
}

_layoutsKeys.configuration = function (zone: string) {
  return [this.all, "configuration", zone]
}

_layoutsKeys.configurations = function (
  query?: HttpTypes.AdminGetLayoutConfigurationsParams
) {
  return [this.all, "configurations", query]
}

export const layoutsQueryKeys = _layoutsKeys

export const useLayoutConfigurations = (
  query?: HttpTypes.AdminGetLayoutConfigurationsParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminLayoutConfigurationListResponse,
      FetchError,
      HttpTypes.AdminLayoutConfigurationListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.layouts.listConfigurations(query),
    queryKey: layoutsQueryKeys.configurations(query),
    ...options,
  })

  return { ...data, ...rest }
}

/**
 * Whether the current user has any layout customization in effect across all
 * zones. Implemented as a `limit: 1` existence check against the list endpoint
 * so it stays cheap regardless of how many configurations exist.
 */
export const useHasLayoutCustomizations = () => {
  const { count, ...rest } = useLayoutConfigurations({
    limit: 1,
    fields: "id",
  })

  return { has_customizations: (count ?? 0) > 0, ...rest }
}

export const useLayoutConfiguration = (
  zone: string,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminLayoutConfigurationResponse,
      FetchError,
      HttpTypes.AdminLayoutConfigurationResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.layouts.retrieveConfiguration(zone),
    queryKey: layoutsQueryKeys.configuration(zone),
    ...options,
  })

  return { ...data, ...rest }
}

export const useSetLayoutConfiguration = (
  zone: string,
  options?: UseMutationOptions<
    HttpTypes.AdminLayoutConfigurationResponse,
    FetchError,
    HttpTypes.AdminSetLayoutConfiguration
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminSetLayoutConfiguration) =>
      sdk.admin.layouts.setConfiguration(zone, payload),
    ...options,
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: layoutsQueryKeys.configuration(zone),
      })
      await queryClient.invalidateQueries({
        queryKey: [layoutsQueryKeys.all, "configurations"],
      })
      options?.onSuccess?.(data, variables, context)
    },
  })
}
