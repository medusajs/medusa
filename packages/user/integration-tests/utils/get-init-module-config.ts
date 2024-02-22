import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"

import { DB_URL } from "./database"

export function getInitModuleConfig() {
  const moduleOptions = {
    defaultAdapterOptions: {
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_USER_DB_SCHEMA,
      },
    },
    jwt_secret: "test",
  }

  const injectedDependencies = {}

  const modulesConfig_ = {
    [Modules.USER]: {
      definition: ModulesDefinition[Modules.USER],
      options: moduleOptions,
    },
  }

  return {
    injectedDependencies,
    modulesConfig: modulesConfig_,
    databaseConfig: {
      clientUrl: DB_URL,
      schema: process.env.MEDUSA_USER_DB_SCHEMA,
    },
    joinerConfig: [],
  }
}
