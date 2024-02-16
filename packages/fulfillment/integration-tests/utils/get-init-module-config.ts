import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"

import { DB_URL } from "./database"
import { knex } from "@mikro-orm/knex"

let connection

function getConnection() {
  if (!connection) {
    connection = knex<any, any>({
      client: "pg",
      searchPath: process.env.MEDUSA_FULFILLMENT_DB_SCHEMA,
      connection: {
        connectionString: DB_URL,
      },
    })
  }

  return connection
}

export function getInitModuleConfig() {
  const moduleOptions = {
    defaultAdapterOptions: {
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_FULFILLMENT_DB_SCHEMA,
      },
    },
  }

  const injectedDependencies = {
    /*[ContainerRegistrationKeys.PG_CONNECTION]: getConnection(),*/
  }

  const modulesConfig_ = {
    [Modules.FULFILLMENT]: {
      definition: ModulesDefinition[Modules.FULFILLMENT],
      options: moduleOptions,
    },
  }

  return {
    injectedDependencies,
    modulesConfig: modulesConfig_,
    databaseConfig: {
      clientUrl: DB_URL,
      schema: process.env.MEDUSA_FULFILLMENT_DB_SCHEMA,
    },
    joinerConfig: [],
  }
}
