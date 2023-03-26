import path from "path"
import { Column, ColumnOptions, ColumnType } from "typeorm"
import getConfigFile from "./get-config-file"

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

let dbType: string
export function resolveDbType(pgSqlType: ColumnType): ColumnType {
  if (!dbType) {
    const { configModule } = getConfigFile(
      path.resolve("."),
      `medusa-config`
    ) as any

    dbType = configModule?.projectConfig?.database_type || "postgres"
  }

  if (dbType === "sqlite" && (pgSqlType as string) in pgSqliteTypeMapping) {
    return pgSqliteTypeMapping[pgSqlType.toString()]
  }
  return pgSqlType
}

export function resolveDbGenerationStrategy(
  pgSqlType: "increment" | "uuid" | "rowid"
): "increment" | "uuid" | "rowid" {
  if (!dbType) {
    const { configModule } = getConfigFile(
      path.resolve("."),
      `medusa-config`
    ) as any

    dbType = configModule?.projectConfig?.database_type || "postgres"
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
