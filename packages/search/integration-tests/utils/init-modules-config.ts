import { DB_URL } from "./database"
import { joinerConfig, modulesConfig, schema } from "../__fixtures__"
import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"

export function getInitModuleConfig({
  remoteQueryMock,
  eventBusMock,
}: {
  remoteQueryMock: any
  eventBusMock: any
  callback?: any
}) {
  const searchEngineModuleOptions = {
    defaultAdapterOptions: {
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_SEARCH_DB_SCHEMA,
      },
    },
    schema,
  }

  const injectedDependencies = {
    eventBusModuleService: eventBusMock,
    remoteQuery: remoteQueryMock,
  }

  const modulesConfig_ = {
    ...modulesConfig,
    [Modules.SEARCH]: {
      definition: ModulesDefinition[Modules.SEARCH],
      options: searchEngineModuleOptions,
    },
  }

  return {
    injectedDependencies,
    modulesConfig: modulesConfig_,
    databaseConfig: {
      clientUrl: DB_URL,
      schema: process.env.MEDUSA_SEARCH_DB_SCHEMA,
    },
    joinerConfig,
  }
}
