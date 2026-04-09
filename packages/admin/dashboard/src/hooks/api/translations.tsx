import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import {
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const TRANSLATIONS_QUERY_KEY = "translations" as const
export const translationsQueryKeys = queryKeysFactory(TRANSLATIONS_QUERY_KEY)

const TRANSLATION_SETTINGS_QUERY_KEY = "translation_settings" as const
export const translationSettingsQueryKeys = queryKeysFactory(
  TRANSLATION_SETTINGS_QUERY_KEY
)

const TRANSLATION_STATISTICS_QUERY_KEY = "translation_statistics" as const
export const translationStatisticsQueryKeys = queryKeysFactory(
  TRANSLATION_STATISTICS_QUERY_KEY
)

const TRANSLATION_ENTITIES_QUERY_KEY = "translation_entities" as const
export const translationEntitiesQueryKeys = queryKeysFactory(
  TRANSLATION_ENTITIES_QUERY_KEY
)

const DEFAULT_PAGE_SIZE = 20

/**
 * Hook to fetch entities with their translatable fields and all translations.
 * Uses the /admin/translations/entities endpoint which returns entities
 * with all their translations for all locales.
 *
 * @param reference - The entity type (e.g., "product", "product_variant")
 * @param referenceId - Optional ID(s) to filter specific entities
 * @param options - React Query options
 */
export const useReferenceTranslations = (
  reference: string,
  referenceId?: string | string[],
  options?: Omit<
    UseInfiniteQueryOptions<
      HttpTypes.AdminTranslationEntitiesResponse,
      FetchError,
      {
        pages: HttpTypes.AdminTranslationEntitiesResponse[]
        pageParams: number[]
      },
      HttpTypes.AdminTranslationEntitiesResponse,
      QueryKey,
      number
    >,
    "queryFn" | "queryKey" | "initialPageParam" | "getNextPageParam"
  >
) => {
  const { data, ...rest } = useInfiniteQuery({
    queryKey: translationEntitiesQueryKeys.list({
      type: reference,
      id: referenceId,
    }),
    queryFn: async ({ pageParam = 0 }) => {
      return sdk.admin.translation.entities({
        type: reference,
        id: referenceId,
        limit: DEFAULT_PAGE_SIZE,
        offset: pageParam,
      })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit
      return nextOffset < lastPage.count ? nextOffset : undefined
    },
    ...options,
  })

  const entitiesWithTranslations =
    data?.pages.flatMap((page) => page.data) ?? []
  const translations = entitiesWithTranslations.flatMap(
    (entity) => entity.translations ?? []
  )
  const references = entitiesWithTranslations.map(
    ({ translations: _, ...entity }) => entity
  )
  const count = data?.pages[0]?.count ?? 0

  return {
    references,
    translations,
    count,
    ...rest,
  }
}

export const useTranslations = (
  query?: HttpTypes.AdminTranslationsListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminTranslationsListResponse,
      FetchError,
      HttpTypes.AdminTranslationsListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: translationsQueryKeys.list(query),
    queryFn: () => sdk.admin.translation.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useBatchTranslations = (
  reference: string,
  options?: UseMutationOptions<
    HttpTypes.AdminTranslationsBatchResponse,
    FetchError,
    HttpTypes.AdminBatchTranslations
  >
) => {
  const mutation = useMutation({
    mutationFn: (payload: HttpTypes.AdminBatchTranslations) =>
      sdk.admin.translation.batch(payload),
    ...options,
  })

  /**
   * Useful to call the invalidation separately from the batch request and await the refetch finishes.
   */
  const invalidateQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: translationEntitiesQueryKeys.list({ type: reference }),
      }),
      queryClient.invalidateQueries({
        queryKey: translationStatisticsQueryKeys.lists(),
      }),
    ])
  }

  return {
    ...mutation,
    invalidateQueries,
  }
}

export const useTranslationSettings = (
  query?: HttpTypes.AdminTranslationSettingsParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminTranslationSettingsResponse,
      FetchError,
      HttpTypes.AdminTranslationSettingsResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: translationSettingsQueryKeys.list(query),
    queryFn: () => sdk.admin.translation.settings(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useBatchTranslationSettings = (
  options?: UseMutationOptions<
    HttpTypes.AdminBatchTranslationSettingsResponse,
    FetchError,
    HttpTypes.AdminBatchTranslationSettings
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminBatchTranslationSettings) =>
      sdk.admin.translation.batchSettings(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: translationSettingsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: translationStatisticsQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useTranslationEntities = (
  query: HttpTypes.AdminTranslationEntitiesParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminTranslationEntitiesResponse,
      FetchError,
      HttpTypes.AdminTranslationEntitiesResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: translationEntitiesQueryKeys.list(query),
    queryFn: () => sdk.admin.translation.entities(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useTranslationStatistics = (
  query?: HttpTypes.AdminTranslationStatisticsParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminTranslationStatisticsResponse,
      FetchError,
      HttpTypes.AdminTranslationStatisticsResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: translationStatisticsQueryKeys.list(query),
    queryFn: () => sdk.admin.translation.statistics(query),
    ...options,
  })

  return { ...data, ...rest }
}
