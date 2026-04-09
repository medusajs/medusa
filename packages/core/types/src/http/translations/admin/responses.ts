import { PaginatedResponse } from "../../common"
import { AdminTranslation, AdminTranslationSettings } from "./entities"

export interface AdminTranslationsResponse {
  /**
   * The list of translations.
   */
  translation: AdminTranslation
}

export type AdminTranslationsListResponse = PaginatedResponse<{
  /**
   * The list of translations.
   */
  translations: AdminTranslation[]
}>

export interface AdminTranslationsBatchResponse {
  /**
   * The created translations.
   */
  created: AdminTranslation[]
  /**
   * The updated translations.
   */
  updated: AdminTranslation[]
  /**
   * The deleted translations.
   */
  deleted: {
    /**
     * The IDs of the deleted translations.
     */
    ids: string[]
    /**
     * The name of the deleted object.
     */
    object: "translation"
    /**
     * Whether the translations were deleted successfully.
     */
    deleted: boolean
  }
}

/**
 * Statistics for a specific locale.
 */
export interface AdminTranslationLocaleStatistics {
  /**
   * Expected number of translated fields.
   */
  expected: number
  /**
   * Actual number of translated fields. This doesn't count
   * translations that are null or empty.
   */
  translated: number
  /**
   * Number of missing translations for expected translatable
   * fields.
   */
  missing: number
}

/**
 * Statistics for an entity type.
 */
export interface AdminTranslationEntityStatistics
  extends AdminTranslationLocaleStatistics {
  /**
   * Breakdown of statistics by locale.
   */
  by_locale: Record<string, AdminTranslationLocaleStatistics>
}

/**
 * Response for translation statistics endpoint.
 */
export interface AdminTranslationStatisticsResponse {
  /**
   * Statistics by entity type.
   */
  statistics: Record<string, AdminTranslationEntityStatistics>
}

/**
 * Response for translation settings endpoint.
 */
export interface AdminTranslationSettingsResponse {
  /**
   * A mapping of entity types to their tranlsation settings.
   *
   * @example
   * {
   *   "product": {
   *     "id": "trset_123",
   *     "fields": ["title", "description", "subtitle", "status"],
   *     "is_active": true,
   *     "inactive_fields": []
   *   },
   *   "product_variant": {
   *     "id": "trset_456",
   *     "fields": ["title", "material"],
   *     "is_active": false,
   *     "inactive_fields": []
   *   }
   * }
   */
  translation_settings: Record<
    string,
    Pick<AdminTranslationSettings, "id" | "fields" | "is_active"> & {
      inactive_fields: string[]
    }
  >
}

export interface AdminBatchTranslationSettingsResponse {
  /**
   * The created settings.
   */
  created: AdminTranslationSettings[]
  /**
   * The updated settings.
   */
  updated: AdminTranslationSettings[]
  /**
   * The deleted settings.
   */
  deleted: {
    ids: string[]
    object: "translation_settings"
    deleted: boolean
  }
}

/**
 * Response for translation entities endpoint.
 * Returns paginated entities with only their translatable fields and all their translations.
 */
export interface AdminTranslationEntitiesResponse {
  /**
   * The list of entities with their translatable fields.
   * Each entity contains only the fields configured as translatable
   * for that entity type in the translation settings, plus all
   * translations for all locales.
   */
  data: (Record<string, unknown> & {
    id: string
    translations: AdminTranslation[]
  })[]

  /**
   * The total count of entities.
   */
  count: number

  /**
   * The offset of the current page.
   */
  offset: number

  /**
   * The limit of items per page.
   */
  limit: number
}
