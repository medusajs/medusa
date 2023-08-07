import {
  Logger,
  MedusaContainer,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
  ModulesSdkTypes,
} from "@medusajs/types"
import { asValue } from "awilix"
import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql"
import { ContainerRegistrationKeys, MedusaError } from "../../common"
import * as ProductModels from "@medusajs/product/dist/models"
import { EntitySchema } from "@mikro-orm/core"
import { loadDatabaseConfig } from "../load-module-database-config"
import { mikroOrmCreateConnection } from "../../dal"

export async function mikroOrmConnectionLoader({
  container,
  options,
  moduleDeclaration,
  logger,
}: {
  container: MedusaContainer
  options:
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  moduleDeclaration?: ModulesSdkTypes.InternalModuleDeclaration
  logger?: Logger
}) {
  let manager = (
    options as ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  )?.manager

  if (
    moduleDeclaration?.scope === MODULE_SCOPE.INTERNAL &&
    moduleDeclaration.resources === MODULE_RESOURCE_TYPE.SHARED &&
    !manager
  ) {
    return await loadShared({ container, logger })
  }

  /**
   * Reuse an existing connection if it is passed in the options
   */
  let dbConfig
  if (!manager) {
    const shouldSwallowError = !!(
      options as ModulesSdkTypes.ModuleServiceInitializeOptions
    )?.database.connection
    dbConfig = {
      ...loadDatabaseConfig(
        "product",
        (options ?? {}) as ModulesSdkTypes.ModuleServiceInitializeOptions,
        shouldSwallowError
      ),
      connection: (options as ModulesSdkTypes.ModuleServiceInitializeOptions)
        ?.database.connection,
    }
  }

  manager ??= await loadDefault({
    database: dbConfig,
  })

  container.register({
    manager: asValue(manager),
  })
}

async function loadDefault({
  database,
}): Promise<SqlEntityManager<PostgreSqlDriver>> {
  if (!database) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      `Database config is not present at module config "options.database"`
    )
  }

  const entities = Object.values(ProductModels) as unknown as EntitySchema[]
  const orm = await mikroOrmCreateConnection(database, entities)

  return orm.em.fork()
}

async function loadShared({ container, logger }) {
  const sharedConnection = container.resolve(
    ContainerRegistrationKeys.PG_CONNECTION,
    {
      allowUnregistered: true,
    }
  )
  if (!sharedConnection) {
    throw new Error(
      "The module is setup to use a shared resources but no shared connection is present. A new connection will be created"
    )
  }

  const manager = await loadDefault({
    database: {
      connection: sharedConnection,
      // clientUrl: "",
    },
  })
  container.register({
    manager: asValue(manager),
  })
}
