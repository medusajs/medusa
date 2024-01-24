import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"

import { DB_URL } from "./database"

export function getInitModuleConfig() {
  const authenticationModuleOptions = {
    defaultAdapterOptions: {
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_CART_DB_SCHEMA,
      },
    },
  }

  const injectedDependencies = {}

  const modulesConfig_ = {
    [Modules.CART]: {
      definition: ModulesDefinition[Modules.CART],
      options: authenticationModuleOptions,
    },
  }

  return {
    injectedDependencies,
    modulesConfig: modulesConfig_,
    databaseConfig: {
      clientUrl: DB_URL,
      schema: process.env.MEDUSA_CART_DB_SCHEMA,
    },
    joinerConfig: [],
  }
}
