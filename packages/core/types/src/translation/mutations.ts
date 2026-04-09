/**
 * The locale to be created.
 */
export interface CreateLocaleDTO {
  /**
   * The ID of the locale to create.
   */
  id?: string

  /**
   * The BCP 47 language tag code of the locale.
   *
   * @example
   * "en-US"
   */
  code: string

  /**
   * The human-readable name of the locale.
   *
   * @example
   * "English (United States)"
   */
  name: string
}

/**
 * The data to update in the locale.
 */
export interface UpdateLocaleDataDTO {
  /**
   * The BCP 47 language tag code of the locale.
   *
   * @example
   * "en-US"
   */
  code?: string

  /**
   * The human-readable name of the locale.
   *
   * @example
   * "English (United States)"
   */
  name?: string
}

/**
 * The attributes to update in the locale.
 */
export interface UpdateLocaleDTO extends UpdateLocaleDataDTO {
  /**
   * The ID of the locale to update.
   */
  id: string
}

/**
 * The attributes in the locale to be created or updated.
 */
export interface UpsertLocaleDTO {
  /**
   * The ID of the locale in case of an update.
   */
  id?: string

  /**
   * The BCP 47 language tag code of the locale.
   *
   * @example
   * "en-US"
   */
  code?: string

  /**
   * The human-readable name of the locale.
   *
   * @example
   * "English (United States)"
   */
  name?: string
}

/**
 * The translation to be created.
 */
export interface CreateTranslationDTO {
  /**
   * The ID of the data model being translated.
   *
   * @example
   * "prod_123"
   */
  reference_id: string

  /**
   * The name of the table that the translation belongs to.
   *
   * @example
   * "product"
   */
  reference: string

  /**
   * The BCP 47 language tag code for this translation.
   *
   * @example
   * "en-US"
   */
  locale_code: string

  /**
   * The translated fields as key-value pairs.
   *
   * @example
   * {
   *   "title": "Product Title",
   *   "description": "Product Description",
   * }
   */
  translations: Record<string, unknown>
}

/**
 * The attributes to update in translations matching a selector.
 */
export interface UpdateTranslationDataDTO {
  /**
   * The ID of the data model being translated.
   *
   * @example
   * "prod_123"
   */
  reference_id?: string

  /**
   * The name of the table that the translation belongs to.
   *
   * @example
   * "product"
   */
  reference?: string

  /**
   * The BCP 47 language tag code for this translation.
   *
   * @example
   * "en-US"
   */
  locale_code?: string

  /**
   * The translated fields as key-value pairs.
   *
   * @example
   * {
   *   "title": "Product Title",
   *   "description": "Product Description",
   * }
   */
  translations?: Record<string, unknown>
}

/**
 * The attributes to update in the translation.
 */
export interface UpdateTranslationDTO extends UpdateTranslationDataDTO {
  /**
   * The ID of the translation to update.
   */
  id: string
}

/**
 * The attributes in the translation to be created or updated.
 */
export interface UpsertTranslationDTO {
  /**
   * The ID of the translation in case of an update.
   */
  id?: string

  /**
   * The ID of the data model being translated.
   *
   * @example
   * "prod_123"
   */
  reference_id?: string

  /**
   * The name of the table that the translation belongs to.
   *
   * @example
   * "product"
   */
  reference?: string

  /**
   * The BCP 47 language tag code for this translation.
   *
   * @example
   * "en-US"
   */
  locale_code?: string

  /**
   * The translated fields as key-value pairs.
   *
   * @example
   * {
   *   "title": "Product Title",
   *   "description": "Product Description",
   * }
   */
  translations?: Record<string, unknown>
}

export interface CreateTranslationSettingsDTO {
  /**
   * The entity type.
   *
   * @example
   * "product"
   */
  entity_type: string
  /**
   * The translatable fields.
   *
   * @example
   * ["title", "description", "material"]
   */
  fields: string[]
  /**
   * Whether the entity translatable status is enabled.
   */
  is_active?: boolean
}

/**
 * The translation settings to be created or updated.
 */
export interface UpdateTranslationSettingsDTO {
  /**
   * The ID of the translation settings to update.
   */
  id: string
  /**
   * The entity type.
   *
   * @example
   * "product"
   */
  entity_type?: string
  /**
   * The translatable fields.
   *
   * @example
   * ["title", "description", "material"]
   */
  fields?: string[]
  /**
   * Whether the entity translatable status is enabled.
   */
  is_active?: boolean
}
