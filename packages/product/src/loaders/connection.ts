import { asValue } from "awilix"

import {
  InternalModuleDeclaration,
  LoaderOptions,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
} from "@medusajs/modules-sdk"
import {
  DALUtils,
  MedusaError,
  ModulesSdkUtils,
  ContainerRegistrationKeys,
} from "@medusajs/utils"

import { EntitySchema } from "@mikro-orm/core"

import * as ProductModels from "@models"
import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql"
import { ModulesSdkTypes } from "@medusajs/types"

export default async (
  {
    options,
    container,
    logger,
  }: LoaderOptions<
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  >,
  moduleDeclaration?: InternalModuleDeclaration
): Promise<void> => {
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
      ...ModulesSdkUtils.loadDatabaseConfig(
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
  const orm = await DALUtils.mikroOrmCreateConnection(database, entities)

  return orm.em.fork()
}

async function loadShared({ container, logger }) {
  const sharedConnection = container.resolve(
    ContainerRegistrationKeys.PG_KNEX_CONNECTION_REGISTRATION_KEY,
    {
      allowUnregistered: true,
    }
  )
  if (!sharedConnection) {
    ;(logger ?? console)?.warn(
      "The Product module is setup to use a shared resources but no shared connection is present. A new connection will be created"
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
