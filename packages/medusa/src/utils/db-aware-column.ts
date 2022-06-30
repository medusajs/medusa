import {
  Column,
  ColumnOptions,
  ColumnType,
  Entity,
  EntityOptions,
  getMetadataArgsStorage,
} from "typeorm"
import path from "path"
import { getConfigFile } from "medusa-core-utils"
import featureFlagsLoader from "../loaders/feature-flags"
import { ConfigModule } from "../types/global"
import { TableMetadataArgs } from "typeorm/metadata-args/TableMetadataArgs"

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
    try {
      const { configModule } = getConfigFile(
        path.resolve("."),
        `medusa-config`
      ) as any
      dbType = configModule.projectConfig.database_type
    } catch (error) {
      // Default to Postgres to allow for e.g. migrations to run
      dbType = "postgres"
    }
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
    try {
      const { configModule } = getConfigFile(
        path.resolve("."),
        `medusa-config`
      ) as any
      dbType = configModule.projectConfig.database_type
    } catch (error) {
      // Default to Postgres to allow for e.g. migrations to run
      dbType = "postgres"
    }
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

export function FeatureFlagColumn(
  featureFlag: string,
  columnOptions: ColumnOptions
): PropertyDecorator {
  const { configModule } = getConfigFile(
    path.resolve("."),
    `medusa-config`
  ) as { configModule: ConfigModule }

  const featureFlagRouter = featureFlagsLoader(configModule)

  if (!featureFlagRouter.featureIsEnabled(featureFlag)) {
    return (target: any): any => target
  }

  return Column(columnOptions)
}

export function FeatureFlagEntity(
  featureFlag: string,
  name?: string,
  options?: EntityOptions
): ClassDecorator {
  console.log(`flag: ${featureFlag}`)
  console.log("FF_Entity before config")

  const { configModule } = getConfigFile(
    path.resolve("."),
    `medusa-config`
  ) as { configModule: ConfigModule }

  console.log("FF_Entity after config")
  console.log(process.env["MEDUSA_FF_CREATE_BATCHES"])

  const featureFlagRouter = featureFlagsLoader(configModule)

  // console.log(process.env)

  console.log("FF_Entity flags loaded")
  console.log(JSON.stringify(featureFlagRouter.flags))
  console.log(featureFlagRouter.featureIsEnabled(featureFlag))

  // if (!featureFlagRouter.featureIsEnabled(featureFlag)) {
  //   return (target: any): any => target
  // }

  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (target: Function): void {
    target["isEnabled"] = function (): boolean {
      const featureFlagRouter = featureFlagsLoader(configModule)
      return featureFlagRouter.featureIsEnabled(featureFlag)
    }
    Entity(name, options)(target)
  }
}

// export function Entity(
//   nameOrOptions?: string | EntityOptions,
//   maybeOptions?: EntityOptions
// ): ClassDecorator {
//   const options =
//     (typeof nameOrOptions === "object"
//       ? (nameOrOptions as EntityOptions)
//       : maybeOptions) || {}
//   const name = typeof nameOrOptions === "string" ? nameOrOptions : options.name\

//   // eslint-disable-next-line @typescript-eslint/ban-types
//   return function (target: Function): void {
//     getMetadataArgsStorage().tables.push({
//       target: target,
//       name: name,
//       type: "regular",
//       orderBy: options.orderBy ? options.orderBy : undefined,
//       engine: options.engine ? options.engine : undefined,
//       database: options.database ? options.database : undefined,
//       schema: options.schema ? options.schema : undefined,
//       synchronize: options.synchronize,
//     } as TableMetadataArgs)
// }
