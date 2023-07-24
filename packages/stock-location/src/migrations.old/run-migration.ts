import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/modules-sdk"
import { DataSource, DataSourceOptions } from "typeorm"
import { StockLocationServiceInitializeOptions } from "../types"

import migrations from "./index"

function getDataSource(
  dbData: StockLocationServiceInitializeOptions["database"]
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
    options?.database as StockLocationServiceInitializeOptions["database"]

  try {
    const dataSource = getDataSource(dbData)
    await dataSource.initialize()
    await dataSource.runMigrations()

    logger?.info("Stock Location module migration executed")
  } catch (error) {
    logger?.error(
      `Stock Location module migration failed to run - Error: ${error}`
    )
  }
}

export async function revertMigration(
  { options, logger }: Omit<LoaderOptions, "container">,
  moduleDeclaration?: InternalModuleDeclaration
) {
  const dbData =
    options?.database as StockLocationServiceInitializeOptions["database"]

  try {
    const dataSource = getDataSource(dbData)
    await dataSource.initialize()
    await dataSource.undoLastMigration()

    logger?.info("Stock Location module migration reverted")
  } catch (error) {
    logger?.error(
      `Stock Location module migration failed to revert - Error: ${error}`
    )
  }
}
