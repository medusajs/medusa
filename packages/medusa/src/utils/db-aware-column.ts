import path from "path"
import { Column, ColumnOptions, ColumnType } from "typeorm"
import { getConfigFile } from "medusa-core-utils"

const pgSqliteTypeMapping: { [key: string]: ColumnType } = {
  timestamptz: "datetime",
  jsonb: "text",
  enum: "text",
}

export function resolveDbType(pgSqlType: ColumnType): ColumnType {
  const { configModule } = getConfigFile(path.resolve("."), `medusa-config`)

  console.log(configModule)
  const dbType = configModule.projectConfig.database_type

  if (dbType === "sqlite" && pgSqlType in pgSqliteTypeMapping) {
    return pgSqliteTypeMapping[pgSqlType.toString()]
  }
  return pgSqlType
}

export function DbAwareColumn(columnOptions: ColumnOptions) {
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
