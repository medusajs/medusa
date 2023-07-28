import { asValue } from "awilix"

import {
  InternalModuleDeclaration,
  LoaderOptions,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
} from "@medusajs/modules-sdk"
import {
  MedusaError,
  ModulesSdkUtils,
  PG_KNEX_CONNECTION_REGISTRATION_KEY,
} from "@medusajs/utils"

import { EntitySchema } from "@mikro-orm/core"

import * as ProductModels from "@models"
import { createConnection } from "../utils"
import { ModulesSdkTypes } from "@medusajs/types"
import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql"

export default async (
  {
    options,
    container,
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
    const sharedConnection = container.resolve(
      PG_KNEX_CONNECTION_REGISTRATION_KEY,
      {
        allowUnregistered: true,
      }
    )
    const logger =
      container.resolve("logger", { allowUnregistered: true }) ?? console

    if (!sharedConnection) {
      logger?.warn(
        "The Product module is setup to use a shared resources but no shared connection is present. A new connection will be created"
      )
    }

    manager = await loadDefault({
      database: {
        driverOptions: sharedConnection,
        clientUrl: "none",
      },
    })
    container.register({
      manager: asValue(manager),
    })

    return
  }

  manager ??= await loadDefault({
    database:
      ModulesSdkUtils.loadDatabaseConfig(
        "product",
        options as ModulesSdkTypes.ModuleServiceInitializeOptions
      ) ?? {},
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
  const orm = await createConnection(database, entities)

  return orm.em.fork()
}
