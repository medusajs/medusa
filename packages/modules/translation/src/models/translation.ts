import { model } from "@medusajs/framework/utils"

const Translation = model
  .define("translation", {
    id: model.id({ prefix: "trans" }).primaryKey(),
    /**
     * The ID of the entity that the translation belongs to. For example, the ID of a product or a product variant.
     */
    reference_id: model.text().searchable(),
    /**
     * The name of the table that the translation belongs to. For example, "product" or "product_variant".
     */
    reference: model.text().searchable(),
    /**
     * The BCP 47 language tag code of the locale
     * 
     * @example
     * "en-US"
     */
    locale_code: model.text().searchable(),
    /**
     * The translations of the entity.
     * The object's keys are the field names of the entity, and its value is the translated value.
     * 
     * @example
     * {
     *   "title": "Product Title",
     *   "description": "Product Description",
     * }
     */
    translations: model.json(),
    /**
     * Precomputed count of translated fields of a resource.
     * Useful for optimization purposes.
     */
    translated_field_count: model.number().default(0),
  })
  .indexes([
    {
      on: ["reference_id", "locale_code"],
      unique: true,
    },
    {
      on: ["reference_id", "reference", "locale_code"],
    },
    {
      on: ["reference", "locale_code"],
    },
    {
      on: ["reference_id", "reference"],
    },
    {
      on: ["locale_code"],
    },
  ])

export default Translation
