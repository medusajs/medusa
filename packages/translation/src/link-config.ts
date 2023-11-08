import { ModuleJoinerConfig } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"
import { composeLinkName } from "@medusajs/link-modules"
import { lowerCaseFirst } from "@medusajs/utils"
import TranslationService from "./services/translation"

const translationServiceName = lowerCaseFirst(TranslationService.name)

export const LinkProductTranslationServiceName = composeLinkName(
  Modules.PRODUCT,
  "product_id",
  translationServiceName,
  "translation_id"
)

export const ProductTranslationLinkConfiguration: ModuleJoinerConfig = {
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
      serviceName: translationServiceName,
      isInternalService: true,
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
        translations: "translations_link.translation",
      },
      relationship: {
        serviceName: LinkProductTranslationServiceName,
        primaryKey: "product_id",
        foreignKey: "id",
        alias: "translations_link",
      },
    },
    {
      serviceName: translationServiceName,
      fieldAlias: {
        product: "product_link.product",
      },
      relationship: {
        serviceName: LinkProductTranslationServiceName,
        primaryKey: "translation_id",
        foreignKey: "id",
        alias: "product_link",
      },
    },
  ],
}
