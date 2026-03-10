interface AdminCreateTranslation {
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
}

interface AdminUpdateTranslation {
  /**
   * The ID of the translation.
   */
  id: string
  /**
   * The translated fields as key-value pairs.
   */
  translations: Record<string, unknown>
}

export interface AdminBatchTranslations {
  /**
   * The translations to create.
   */
  create?: AdminCreateTranslation[]
  /**
   * The translations to update.
   */
  update?: AdminUpdateTranslation[]
  /**
   * The translations to delete.
   */
  delete?: string[]
}

interface AdminCreateTranslationSettings {
  /**
   * The entity type (e.g., "product", "product_variant").
   */
  entity_type: string
  /**
   * The translatable fields for this entity type.
   */
  fields: string[]
  /**
   * Whether the entity translatable status is enabled.
   */
  is_active?: boolean
}

interface AdminUpdateTranslationSettings {
  /**
   * The ID of the settings.
   */
  id: string
  /**
   * The entity type (e.g., "product", "product_variant").
   */
  entity_type?: string
  /**
   * The translatable fields for this entity type.
   */
  fields?: string[]
  /**
   * Whether the entity translatable status is enabled.
   */
  is_active?: boolean
}

export interface AdminBatchTranslationSettings {
  /**
   * The translation settings to create.
   */
  create?: AdminCreateTranslationSettings[]
  /**
   * The translation settings to update.
   */
  update?: AdminUpdateTranslationSettings[]
  /**
   * The translation settings to delete (IDs).
   */
  delete?: string[]
}
