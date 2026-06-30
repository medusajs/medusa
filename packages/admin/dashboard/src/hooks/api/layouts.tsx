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
}

_layoutsKeys.configuration = function (zone: string) {
  return [this.all, "configuration", zone]
}

export const layoutsQueryKeys = _layoutsKeys

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
      options?.onSuccess?.(data, variables, context)
    },
  })
}
