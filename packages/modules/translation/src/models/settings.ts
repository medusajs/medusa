import { model } from "@medusajs/framework/utils"

/**
 * @since 2.12.4
 */
const Settings = model
  .define("translation_settings", {
    id: model.id({ prefix: "trset" }).primaryKey(),
    /**
     * The entity type that these settings apply to (e.g., "product", "product_variant").
     */
    entity_type: model.text().searchable(),
    /**
     * The translatable fields for this entity type.
     * Array of field names that can be translated.
     *
     * @example
     * ["title", "description", "material"]
     */
    fields: model.json(),
    /**
     * Wether the entity translatable status is enabled.
     * 
     * @since 2.13.0
     */
    is_active: model.boolean().default(true),
  })
  .indexes([
    {
      on: ["entity_type"],
      unique: true,
    },
  ])

export default Settings
