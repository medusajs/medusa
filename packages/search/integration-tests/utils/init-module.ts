import { knex } from "knex"
import { DB_URL } from "./database"
import { joinerConfig, schema } from "../__fixtures__"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import {
  MedusaApp,
  MedusaModule,
  Modules,
  ModulesDefinition,
} from "@medusajs/modules-sdk"
import modulesConfig from "../__fixtures__/modules-config"
import { ISearchModuleService } from "@medusajs/types"

export async function initModules({
  remoteQueryMock,
  eventBusMock,
  callback,
}: {
  remoteQueryMock: any
  eventBusMock: any
  callback?: any
}) {
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

  const injectedDependencies = {
    [ContainerRegistrationKeys.PG_CONNECTION]: sharedPgConnection,
    eventBusModuleService: eventBusMock,
    remoteQuery: remoteQueryMock,
  }

  const { modules } = await MedusaApp({
    modulesConfig: {
      ...modulesConfig,
      [Modules.SEARCH]: {
        definition: ModulesDefinition[Modules.SEARCH],
        options: searchEngineModuleOptions,
      },
    },
    servicesConfig: joinerConfig,
    injectedDependencies,
    onApplicationStartCb: callback,
  })

  async function shutdown() {
    await (sharedPgConnection as any).context?.destroy()
    MedusaModule.clearInstances()
  }

  return {
    searchService: modules.searchService as unknown as ISearchModuleService,
    shutdown,
  }
}
