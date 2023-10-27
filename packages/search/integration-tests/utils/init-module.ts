import { knex } from "knex"
import { DB_URL } from "./database"
import { EventBusService, joinerConfig, schema } from "../__fixtures__"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { MedusaApp, Modules } from "@medusajs/modules-sdk"
import modulesConfig from "../__fixtures__/modules-config"
import { ISearchModuleService } from "@medusajs/types"

export async function initModules({ remoteQueryMock, eventBusMock }) {
  const sharedPgConnection = knex<any, any>({
    client: "pg",
    searchPath: process.env.MEDUSA_SEARCH_DB_SCHEMA,
    connection: {
      connectionString: DB_URL,
    },
  })

  const searchEngineModuleOptions = {
    defaultAdapterOptions: {
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_SEARCH_DB_SCHEMA,
      },
    },
    schema,
  }

  const eventBus = new EventBusService()

  const injectedDependencies = {
    [ContainerRegistrationKeys.PG_CONNECTION]: sharedPgConnection,
    eventBusModuleService: eventBusMock,
    remoteQuery: remoteQueryMock,
  }

  const { modules } = await MedusaApp({
    modulesConfig: {
      ...modulesConfig,
      [Modules.SEARCH]: {
        options: searchEngineModuleOptions,
      },
    },
    servicesConfig: joinerConfig,
    injectedDependencies,
  })

  return modules.searchService as unknown as ISearchModuleService
}
