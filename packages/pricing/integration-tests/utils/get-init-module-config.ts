import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"

import { DB_URL } from "./database"

export function getInitModuleConfig() {
  const moduleOptions = {
    defaultAdapterOptions: {
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PRICING_DB_SCHEMA,
      },
    },
  }

  const modulesConfig_ = {
    [Modules.PRODUCT]: true,
    [Modules.PRICING]: {
      definition: ModulesDefinition[Modules.PRICING],
      options: moduleOptions,
    },
  }

  return {
    modulesConfig: modulesConfig_,
    databaseConfig: {
      clientUrl: DB_URL,
      schema: process.env.MEDUSA_PRICING_DB_SCHEMA,
    },
    joinerConfig: [],
  }
}
