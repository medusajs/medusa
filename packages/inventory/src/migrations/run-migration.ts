import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/modules-sdk"
import { DataSource, DataSourceOptions } from "typeorm"
import { InventoryServiceInitializeOptions } from "../types"

import migrations from "./index"

function getDataSource(
  dbData: InventoryServiceInitializeOptions["database"]
): DataSource {
  return new DataSource({
    type: dbData!.type,
    url: dbData!.url,
    database: dbData!.database,
    extra: dbData!.extra || {},
    migrations: migrations
      .map((migration: any): Function[] => {
        return Object.values(migration).filter(
          (fn) => typeof fn === "function"
        ) as Function[]
      })
      .flat(),
    schema: dbData!.schema,
    logging: dbData!.logging,
  } as DataSourceOptions)
}

export async function runMigrations(
  { options, logger }: Omit<LoaderOptions, "container">,
  moduleDeclaration?: InternalModuleDeclaration
) {
  const dbData =
    options?.database as InventoryServiceInitializeOptions["database"]

  try {
    const dataSource = getDataSource(dbData)
    await dataSource.initialize()
    await dataSource.runMigrations()

    logger?.info("Inventory module migration executed")
  } catch (error) {
    logger?.error(`Inventory module migration failed to run - Error: ${error}`)
  }
}

export async function revertMigration(
  { options, logger }: Omit<LoaderOptions, "container">,
  moduleDeclaration?: InternalModuleDeclaration
) {
  const dbData =
    options?.database as InventoryServiceInitializeOptions["database"]

  try {
    const dataSource = getDataSource(dbData)
    await dataSource.initialize()
    await dataSource.undoLastMigration()

    logger?.info("Inventory module migration reverted")
  } catch (error) {
    logger?.error(
      `Inventory module migration failed to revert - Error: ${error}`
    )
  }
}
