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
  { options }: LoaderOptions,
  moduleDeclaration?: InternalModuleDeclaration
) {
  const dbData =
    options?.database as InventoryServiceInitializeOptions["database"]

  const dataSource = getDataSource(dbData)
  await dataSource.initialize()
  await dataSource.runMigrations()
}

export async function revertMigration(
  { options }: LoaderOptions,
  moduleDeclaration?: InternalModuleDeclaration
) {
  const dbData =
    options?.database as InventoryServiceInitializeOptions["database"]

  const dataSource = getDataSource(dbData)
  await dataSource.initialize()
  await dataSource.undoLastMigration()
}
