import { ModuleJoinerConfig } from "@medusajs/types"
import moduleSchema from "./schema"
import { Translation } from "./models/translation"

export const LinkableKeys = {
  translation_id: Translation.name,
}

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: "translationService",
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
