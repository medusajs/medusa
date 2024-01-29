import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"

import { DB_URL } from "./database"

export function getInitModuleConfig() {
  const moduleOptions = {
    defaultAdapterOptions: {
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_AUTH_DB_SCHEMA,
      },
    },
    providers: [
      {
        name: "emailpass",
        scopes: {
          admin: {},
          store: {},
        },
      },
    ],
  }

  const injectedDependencies = {}

  const modulesConfig_ = {
    [Modules.AUTH]: {
      definition: ModulesDefinition[Modules.AUTH],
      options: moduleOptions,
    },
  }

  return {
    injectedDependencies,
    modulesConfig: modulesConfig_,
    databaseConfig: {
      clientUrl: DB_URL,
      schema: process.env.MEDUSA_AUTH_DB_SCHEMA,
    },
    joinerConfig: [],
  }
}
