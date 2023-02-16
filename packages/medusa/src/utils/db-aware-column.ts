import { Column, ColumnOptions, ColumnType } from "typeorm"
import path from "path"
import { getConfigFile } from "medusa-core-utils"
import { asyncLoadConfig } from "./async-load-config"
import { handleConfigError } from "../loaders/config"

const pgSqliteTypeMapping: { [key: string]: ColumnType } = {
  increment: "rowid",
  timestamptz: "datetime",
  jsonb: "simple-json",
  enum: "text",
}

const pgSqliteGenerationMapping: {
  [key: string]: "increment" | "uuid" | "rowid"
} = {
  increment: "rowid",
}

let dbType = "postgres"
export function resolveDbType(
  pgSqlType: ColumnType,
  directory?: string,
  filename?: string
): ColumnType {
  if (!dbType) {
    /* const { configModule } = getConfigFile(
      path.resolve("."),
      `medusa-config`
    ) as any*/
    if (!directory) {
      directory = process.cwd()
    }
    if (!filename) {
      filename = "medusa-config"
    }
    let configModule
    asyncLoadConfig(directory, filename)
      .then((config) => {
        configModule = config
        dbType = configModule?.projectConfig?.database_type || "postgres"
      })
      .catch((e) => {
        handleConfigError(new Error(e))
      })
  }

  if (dbType === "sqlite" && (pgSqlType as string) in pgSqliteTypeMapping) {
    return pgSqliteTypeMapping[pgSqlType.toString()]
  }
  return pgSqlType
}

export function resolveDbGenerationStrategy(
  pgSqlType: "increment" | "uuid" | "rowid",
  directory?: string,
  filename?: string
): "increment" | "uuid" | "rowid" {
  if (!dbType) {
    /* const { configModule } = getConfigFile(
      path.resolve("."),
      `medusa-config`
    ) as any*/
    if (!directory) {
      directory = process.cwd()
    }
    if (!filename) {
      filename = "medusa-config"
    }
    let configModule
    asyncLoadConfig(directory, filename)
      .then((config) => {
        configModule = config
        dbType = configModule?.projectConfig?.database_type || "postgres"
      })
      .catch((e) => {
        handleConfigError(new Error(e))
      })
  }

  if (dbType === "sqlite" && pgSqlType in pgSqliteTypeMapping) {
    return pgSqliteGenerationMapping[pgSqlType]
  }
  return pgSqlType
}

export function DbAwareColumn(columnOptions: ColumnOptions): PropertyDecorator {
  const pre = columnOptions.type
  if (columnOptions.type) {
    columnOptions.type = resolveDbType(columnOptions.type)
  }

  if (pre === "jsonb" && pre !== columnOptions.type) {
    if ("default" in columnOptions) {
      columnOptions.default = JSON.stringify(columnOptions.default)
    }
  }

  return Column(columnOptions)
}
