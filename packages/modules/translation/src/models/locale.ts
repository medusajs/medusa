import { model } from "@medusajs/framework/utils"

const Locale = model
  .define("locale", {
    id: model.id({ prefix: "loc" }).primaryKey(),
    /**
     * The BCP 47 language tag code of the locale (e.g., "en-US", "da-DK").
     */
    code: model.text().searchable(),
    /**
     * The human-readable name of the locale (e.g., "English (US)", "Danish").
     */
    name: model.text().searchable(),
  })
  .indexes([
    {
      on: ["code"],
      unique: true,
    },
  ])

export default Locale
