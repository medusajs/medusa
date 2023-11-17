import { ModuleJoinerConfig } from "@medusajs/types"
import moduleSchema from "./schema"
import { Translation } from "./models/translation"
import TranslationService from "./services/translation"
import { lowerCaseFirst } from "@medusajs/utils"

export const LinkableKeys = {
  translation_id: Translation.name,
}

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: lowerCaseFirst(TranslationService.name),
  primaryKeys: ["id"],
  linkableKeys: LinkableKeys,
  schema: moduleSchema,
  alias: [
    {
      name: ["translation", "translations"],
      args: {
        entity: Translation.name,
      },
    },
  ],
}
