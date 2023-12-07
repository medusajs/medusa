import {
  Logger,
  MedusaContainer,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
  ModulesSdkTypes,
} from "@medusajs/types"
import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql"
import { asValue } from "awilix"
import { ContainerRegistrationKeys, MedusaError } from "../../common"
import { mikroOrmCreateConnection } from "../../dal"
import { loadDatabaseConfig } from "../load-module-database-config"

export async function mikroOrmConnectionLoader({
  moduleName,
  container,
  options,
  moduleDeclaration,
  entities,
  pathToMigrations,
}: {
  moduleName: string
  entities: any[]
  container: MedusaContainer
  options?:
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  moduleDeclaration?: ModulesSdkTypes.InternalModuleDeclaration
  logger?: Logger
  pathToMigrations: string
}) {
  let manager = (
    options as ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  )?.manager

  // Custom manager provided
  if (manager) {
    container.register({
      manager: asValue(manager),
    })
    return
  }

  if (
    moduleDeclaration?.scope === MODULE_SCOPE.INTERNAL &&
    moduleDeclaration.resources === MODULE_RESOURCE_TYPE.SHARED
  ) {
    const shouldSwallowError = true
    const dbConfig = loadDatabaseConfig(
      moduleName,
      (options ?? {}) as ModulesSdkTypes.ModuleServiceInitializeOptions,
      shouldSwallowError
    )
    return await loadShared({
      database: dbConfig,
      container,
      entities,
      pathToMigrations,
    })
  }

  /**
   * Reuse an existing connection if it is passed in the options
   */
  let dbConfig
  const shouldSwallowError = !!(
    options as ModulesSdkTypes.ModuleServiceInitializeOptions
  )?.database?.connection
  dbConfig = {
    ...loadDatabaseConfig(
      moduleName,
      (options ?? {}) as ModulesSdkTypes.ModuleServiceInitializeOptions,
      shouldSwallowError
    ),
    connection: (options as ModulesSdkTypes.ModuleServiceInitializeOptions)
      ?.database?.connection,
  }

  manager ??= await loadDefault({
    database: dbConfig,
    entities,
    pathToMigrations,
  })

  container.register({
    manager: asValue(manager),
  })
}

async function loadDefault({
  database,
  entities,
  pathToMigrations,
}): Promise<SqlEntityManager<PostgreSqlDriver>> {
  if (!database) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      `Database config is not present at module config "options.database"`
    )
  }

  const orm = await mikroOrmCreateConnection(
    database,
    entities,
    pathToMigrations
  )

  return orm.em.fork()
}

async function loadShared({ database, container, entities, pathToMigrations }) {
  const sharedConnection = container.resolve(
    ContainerRegistrationKeys.PG_CONNECTION,
    {
      allowUnregistered: true,
    }
  )
  if (!sharedConnection) {
    throw new Error(
      "The module is setup to use a shared resources but no shared connection is present."
    )
  }

  const manager = await loadDefault({
    entities,
    database: {
      ...database,
      connection: sharedConnection,
    },
    pathToMigrations,
  })
  container.register({
    manager: asValue(manager),
  })
}
