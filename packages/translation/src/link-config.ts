import { ModuleJoinerConfig } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"
import { composeLinkName } from "@medusajs/link-modules"

export const LinkProductTranslationServiceName = composeLinkName(
  Modules.PRODUCT,
  "product_id",
  "translationService",
  "translation_id"
)

export const ProductTranslation: ModuleJoinerConfig = {
  serviceName: LinkProductTranslationServiceName,
  isLink: true,
  databaseConfig: {
    tableName: "product_translation",
    idPrefix: "prodtrans",
  },
  primaryKeys: ["id", "product_id", "translation_id"],
  alias: [
    {
      name: ["product_translation", "product_translations"],
    },
  ],
  relationships: [
    {
      serviceName: Modules.PRODUCT,
      primaryKey: "id",
      foreignKey: "product_id",
      alias: "product",
    },
    {
      serviceName: "translationService",
      primaryKey: "id",
      foreignKey: "translation_id",
      alias: "translation",
      deleteCascade: true,
    },
  ],
  extends: [
    {
      serviceName: Modules.PRODUCT,
      fieldAlias: {
        translations: "product_translations.translation",
      },
      relationship: {
        serviceName: "productService",
        primaryKey: "product_id",
        foreignKey: "id",
        alias: "translations",
      },
    },
    {
      serviceName: LinkProductTranslationServiceName,
      relationship: {
        serviceName: "translationService",
        primaryKey: "translation_id",
        foreignKey: "id",
        alias: "product_link",
      },
    },
  ],
}
