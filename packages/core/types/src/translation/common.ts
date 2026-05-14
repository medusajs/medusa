import { BaseFilterable, OperatorMap } from "../dal"

/**
 * The locale details.
 */
export interface LocaleDTO {
  /**
   * The ID of the locale.
   */
  id: string

  /**
   * The BCP 47 language tag code of the locale (e.g., "en-US", "fr-FR").
   */
  code: string

  /**
   * The human-readable name of the locale (e.g., "English (United States)").
   */
  name: string

  /**
   * The date and time the locale was created.
   */
  created_at: Date | string

  /**
   * The date and time the locale was last updated.
   */
  updated_at: Date | string

  /**
   * The date and time the locale was deleted.
   */
  deleted_at: Date | string | null
}

/**
 * The translation details.
 */
export interface TranslationDTO {
  /**
   * The ID of the translation.
   */
  id: string

  /**
   * The ID of the entity being translated.
   */
  reference_id: string

  /**
   * The type of entity being translated (e.g., "product", "product_variant").
   */
  reference: string

  /**
   * The BCP 47 language tag code for this translation (e.g., "en-US", "fr-FR").
   */
  locale_code: string

  /**
   * The translated fields as key-value pairs.
   */
  translations: Record<string, unknown>

  /**
   * The date and time the translation was created.
   */
  created_at: Date | string

  /**
   * The date and time the translation was last updated.
   */
  updated_at: Date | string

  /**
   * The date and time the translation was deleted.
   */
  deleted_at: Date | string | null
}

/**
 * The translation settings details.
 */
export interface TranslationSettingsDTO {
  /**
   * The ID of the settings record.
   */
  id: string

  /**
   * The entity type these settings apply to (e.g., "product", "product_variant").
   */
  entity_type: string

  /**
   * The translatable fields for this entity type.
   */
  fields: string[]

  /**
   * Whether the entity translatable status is enabled.
   */
  is_active: boolean

  /**
   * The date and time the settings were created.
   */
  created_at: Date | string

  /**
   * The date and time the settings were last updated.
   */
  updated_at: Date | string

  /**
   * The date and time the settings were deleted.
   */
  deleted_at: Date | string | null
}

/**
 * The filters to apply on the retrieved locales.
 */
export interface FilterableLocaleProps
  extends BaseFilterable<FilterableLocaleProps> {
  /**
   * The IDs to filter the locales by.
   */
  id?: string[] | string | OperatorMap<string | string[]>

  /**
   * Filter locales by their code.
   */
  code?: string | string[] | OperatorMap<string>

  /**
   * Filter locales by their name.
   */
  name?: string | OperatorMap<string>
}

/**
 * The filters to apply on the retrieved translations.
 */
export interface FilterableTranslationProps
  extends BaseFilterable<FilterableTranslationProps> {
  /**
   * Search through translated content using this search term.
   * This searches within the JSONB translations field values.
   */
  q?: string

  /**
   * The IDs to filter the translations by.
   */
  id?: string[] | string | OperatorMap<string | string[]>

  /**
   * Filter translations by entity ID.
   */
  reference_id?: string | string[] | OperatorMap<string>

  /**
   * Filter translations by entity type.
   */
  reference?: string | string[] | OperatorMap<string>

  /**
   * Filter translations by locale code.
   */
  locale_code?: string | string[] | OperatorMap<string>
}

export interface FilterableTranslationSettingsProps
  extends BaseFilterable<FilterableTranslationSettingsProps> {
  /**
   * The IDs to filter the translation settings by.
   */
  id?: string[] | string | OperatorMap<string | string[]>

  /**
   * Filter translation settings by entity type.
   */
  entity_type?: string | string[] | OperatorMap<string | string[]>
  /**
   * Filter translation settings by active status.
   */
  is_active?: boolean | OperatorMap<boolean>
}

/**
 * Input for getStatistics method.
 */
export interface TranslationStatisticsInput {
  /**
   * Locales to check translations for.
   *
   * @example
   * ["en-US", "fr-FR"]
   */
  locales: string[]

  /**
   * Key-value pairs of entity types and their configurations.
   */
  entities: Record<
    string,
    {
      /**
       * Total number of records for the entity type.
       * For example, total number of products.
       *
       * This is necessary to compute expected translation counts.
       */
      count: number
    }
  >
}

/**
 * Statistics for a specific locale.
 */
export interface LocaleStatistics {
  /**
   * Expected total number of translated fields.
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
export interface EntityTypeStatistics extends LocaleStatistics {
  /**
   * Breakdown of statistics by locale.
   */
  by_locale: Record<string, LocaleStatistics>
}

/**
 * Output of getStatistics method.
 * Maps entity types to their translation statistics.
 */
export type TranslationStatisticsOutput = Record<string, EntityTypeStatistics>
