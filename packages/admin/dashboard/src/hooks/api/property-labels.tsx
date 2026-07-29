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
import { queryKeysFactory } from "../../lib/query-key-factory"
import { viewsQueryKeys } from "./views"

const PROPERTY_LABELS_QUERY_KEY = "property_labels" as const
export const propertyLabelsQueryKeys = queryKeysFactory(
  PROPERTY_LABELS_QUERY_KEY
)

export const usePropertyLabels = (
  query?: HttpTypes.AdminGetPropertyLabelsParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminPropertyLabelListResponse,
      FetchError,
      HttpTypes.AdminPropertyLabelListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.propertyLabel.list(query),
    queryKey: propertyLabelsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const usePropertyLabel = (
  id: string,
  query?: HttpTypes.AdminGetPropertyLabelParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminPropertyLabelResponse,
      FetchError,
      HttpTypes.AdminPropertyLabelResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.propertyLabel.retrieve(id, query),
    queryKey: propertyLabelsQueryKeys.detail(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreatePropertyLabel = (
  options?: UseMutationOptions<
    HttpTypes.AdminPropertyLabelResponse,
    FetchError,
    HttpTypes.AdminCreatePropertyLabel
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.propertyLabel.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: propertyLabelsQueryKeys.all })
      queryClient.invalidateQueries({
        queryKey: viewsQueryKeys.columns(data.property_label.entity),
      })
      queryClient.invalidateQueries({ queryKey: viewsQueryKeys.entities() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdatePropertyLabel = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminPropertyLabelResponse,
    FetchError,
    Omit<HttpTypes.AdminUpdatePropertyLabel, "id">
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.propertyLabel.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: propertyLabelsQueryKeys.all })
      queryClient.invalidateQueries({
        queryKey: viewsQueryKeys.columns(data.property_label.entity),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeletePropertyLabel = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminPropertyLabelDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.propertyLabel.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: propertyLabelsQueryKeys.all })
      queryClient.invalidateQueries({
        queryKey: viewsQueryKeys.columns(),
      })
      queryClient.invalidateQueries({ queryKey: viewsQueryKeys.entities() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useBatchPropertyLabels = (
  options?: UseMutationOptions<
    HttpTypes.AdminBatchPropertyLabelResponse,
    FetchError,
    HttpTypes.AdminBatchPropertyLabels
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.propertyLabel.batch(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: propertyLabelsQueryKeys.all })
      queryClient.invalidateQueries({
        queryKey: viewsQueryKeys.columns(),
      })
      queryClient.invalidateQueries({ queryKey: viewsQueryKeys.entities() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
