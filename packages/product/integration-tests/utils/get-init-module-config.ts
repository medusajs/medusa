import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"

import { DB_URL } from "./database"
import { EventBusService } from "../__fixtures__/event-bus"

export function getInitModuleConfig(additionalOptions: any = {}) {
  const moduleOptions = {
    defaultAdapterOptions: {
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
      },
    },
    ...additionalOptions,
  }

  const modulesConfig_ = {
    [Modules.PRODUCT]: {
      definition: ModulesDefinition[Modules.PRODUCT],
      options: moduleOptions,
    },
  }

  const injectedDependencies = { eventBustModuleService: new EventBusService() }

  return {
    injectedDependencies,
    modulesConfig: modulesConfig_,
    databaseConfig: {
      clientUrl: DB_URL,
      schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
    },
    joinerConfig: [],
  }
}
