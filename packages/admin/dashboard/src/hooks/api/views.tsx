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

const VIEWS_QUERY_KEY = "views" as const
const _viewsKeys = queryKeysFactory(VIEWS_QUERY_KEY) as TQueryKey<"views"> & {
  columns: (entity?: string) => any
  active: (entity: string) => any
  configurations: (entity: string, query?: any) => any
  entities: (entity?: string, query?: any) => any
}

_viewsKeys.columns = function (entity?: string) {
  return [this.all, "columns", entity].filter((k) => !!k)
}

_viewsKeys.active = function (entity: string) {
  return [this.detail(entity), "active"]
}

_viewsKeys.configurations = function (entity: string, query?: any) {
  const key = [this.all, "configurations", entity]
  if (query !== undefined) {
    key.push(query)
  }
  return key
}

_viewsKeys.entities = function (entity?: string, query?: any) {
  return [(this.all, "entities", entity, query)].filter((k) => !!k)
}

export const viewsQueryKeys = _viewsKeys

export const useEntities = (
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminEntityListResponse,
      FetchError,
      HttpTypes.AdminEntityListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.views.listEntities(),
    queryKey: viewsQueryKeys.entities(),
    ...options,
  })

  return { ...data, ...rest }
}

// Generic hook to get columns for any entity
export const useEntityColumns = (
  entity: string,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminViewsEntityColumnsResponse,
      FetchError,
      HttpTypes.AdminViewsEntityColumnsResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.views.columns(entity),
    queryKey: viewsQueryKeys.columns(entity),
    ...options,
  })

  return { ...data, ...rest }
}

// View Configuration hooks

// List view configurations for an entity
export const useViewConfigurations = (
  entity: string,
  query?: HttpTypes.AdminGetViewConfigurationsParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminViewConfigurationListResponse,
      FetchError,
      HttpTypes.AdminViewConfigurationListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.views.listConfigurations(entity, query),
    queryKey: viewsQueryKeys.configurations(entity, query),
    ...options,
  })

  return { ...data, ...rest }
}

// Get active view configuration for an entity
export const useActiveViewConfiguration = (
  entity: string,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminViewConfigurationResponse & {
        active_view_configuration_id?: string | null
        is_default_active?: boolean
        default_type?: "system" | "code"
      },
      FetchError,
      HttpTypes.AdminViewConfigurationResponse & {
        active_view_configuration_id?: string | null
        is_default_active?: boolean
        default_type?: "system" | "code"
      },
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const query = useQuery({
    queryFn: () => sdk.admin.views.retrieveActiveConfiguration(entity),
    queryKey: viewsQueryKeys.active(entity),
    ...options,
  })

  const { data, ...rest } = query

  return { ...data, ...rest }
}

// Get a specific view configuration
export const useViewConfiguration = (
  entity: string,
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminViewConfigurationResponse,
      FetchError,
      HttpTypes.AdminViewConfigurationResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.views.retrieveConfiguration(entity, id, query),
    queryKey: viewsQueryKeys.detail(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

// Create view configuration with toast notifications
export const useCreateViewConfiguration = (
  entity: string,
  options?: UseMutationOptions<
    HttpTypes.AdminViewConfigurationResponse,
    FetchError,
    HttpTypes.AdminCreateViewConfiguration
  >
) => {
  return useMutation({
    mutationFn: (
      payload: Omit<HttpTypes.AdminCreateViewConfiguration, "entity">
    ) => sdk.admin.views.createConfiguration(entity, payload),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: viewsQueryKeys.configurations(entity),
      })
      // If set_active was true, also invalidate the active configuration
      if ((variables as any).set_active) {
        queryClient.invalidateQueries({
          queryKey: viewsQueryKeys.active(entity),
        })
      }
      options?.onSuccess?.(data, variables, context)
    },
  })
}

// Update view configuration
export const useUpdateViewConfiguration = (
  entity: string,
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminViewConfigurationResponse,
    FetchError,
    HttpTypes.AdminUpdateViewConfiguration
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminUpdateViewConfiguration) =>
      sdk.admin.views.updateConfiguration(entity, id, payload),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: viewsQueryKeys.configurations(entity),
      })
      queryClient.invalidateQueries({ queryKey: viewsQueryKeys.detail(id) })
      // Also invalidate active configuration if this view is currently active
      queryClient.invalidateQueries({ queryKey: viewsQueryKeys.active(entity) })
      options?.onSuccess?.(data, variables, context)
    },
  })
}

// Delete view configuration
export const useDeleteViewConfiguration = (
  entity: string,
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminViewConfigurationDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.views.deleteConfiguration(entity, id),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: viewsQueryKeys.configurations(entity),
      })
      queryClient.invalidateQueries({ queryKey: viewsQueryKeys.detail(id) })
      // Also invalidate active configuration as it might have changed
      queryClient.invalidateQueries({
        queryKey: viewsQueryKeys.active(entity),
      })
      options?.onSuccess?.(data, variables, context)
    },
  })
}

// Set active view configuration
export const useSetActiveViewConfiguration = (
  entity: string,
  options?: UseMutationOptions<{ success: boolean }, FetchError, string | null>
) => {
  return useMutation({
    mutationFn: (viewConfigurationId: string | null) => {
      return sdk.admin.views.setActiveConfiguration(entity, {
        view_configuration_id: viewConfigurationId,
      })
    },
    ...options,
    onSuccess: async (data, variables, context) => {
      // Invalidate active configuration
      await queryClient.invalidateQueries({
        queryKey: viewsQueryKeys.active(entity),
      })
      // Also invalidate the list as the active status might be shown there
      await queryClient.invalidateQueries({
        queryKey: viewsQueryKeys.configurations(entity),
      })
      options?.onSuccess?.(data, variables, context)
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context)
    },
  })
}
