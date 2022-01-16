import glob from "glob"
import path from "path"
import {
  Column,
  ColumnOptions,
  ColumnType,
  ConnectionOptions,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm"
import { asClass, asValue } from "awilix"

import formatRegistrationName from "../utils/format-registration-name"

import {
  SimpleColumnType,
  SpatialColumnType,
  WithLengthColumnType,
  WithPrecisionColumnType,
  WithWidthColumnType,
} from "typeorm/driver/types/ColumnTypes"
import { DateUtils } from "typeorm/util/DateUtils"

type Constructor<T> = (new (...args: any[]) => T);

type CustomField = {
  name: string;
  isPrivate?: boolean;
  list?: boolean;
  entity?: any;
  eager?: boolean;
  defaultValue?: any;
  nullable?: boolean;
  type: "relation"
    | WithPrecisionColumnType
    | WithLengthColumnType
    | WithWidthColumnType
    | SpatialColumnType
    | SimpleColumnType
    | BooleanConstructor
    | DateConstructor
    | NumberConstructor
    | StringConstructor;
};

type Config = {
  projectConfig: { database_type: ConnectionOptions["type"] },
  customFields: {
    [entityName: string]: CustomField[]
  }
};

/**
 * Registers all models in the model directory
 */
export default ({ container }, config: Config, register: boolean = true) => {
  let corePath = "../models/*.js"
  const coreFull = path.join(__dirname, corePath)

  const toReturn: any[] = []

  const core = glob.sync(coreFull, { cwd: __dirname })
  core.forEach(fn => {
    const loaded = require(fn)

    Object.entries(loaded).map(([, val]) => {
      if (typeof val === "function") {
        if (register) {
          const name = formatRegistrationName(fn)
          container.register({
            [name]: asClass(val as Constructor<any>),
          })

          const instance = container.resolve(name)
          applyCustomFields(instance, config)

          container.registerAdd("db_entities", asValue(val))
        }

        toReturn.push(val as any)
      }
    })
  })

  return toReturn
}


function applyCustomFields<TEntity = any>(entity: TEntity, config: Config): any {
  const { projectConfig: { database_type }, customFields } = config

  const entityCustomFields = (customFields || {})[(entity as any).constructor.name] ?? [];
  if (!entityCustomFields?.length) {
    return entity
  }

  for (const customField of entityCustomFields) {
    if (customField.type === "relation") {
      if (customField.list) {
        ManyToMany(type => customField.entity, { eager: customField.eager })(entity, customField.name)
        JoinTable()(entity, customField.name)
      } else {
        ManyToOne(type => customField.entity, { eager: customField.eager })(entity, customField.name)
        JoinColumn()(entity, customField.name)
      }
    } else {
      const options: ColumnOptions = {
        type: customField.list ? "simple-json" : getColumnType(database_type, customField.type),
        default: getDefault(customField, database_type),
        name: customField.name,
        nullable: !!customField.nullable,
      }
      Column(options)(entity, customField.name)
    }
  }

  return entity
}

function getColumnType(
  dbEngine: ConnectionOptions["type"],
  type: Exclude<CustomField["type"], "relation">,
): ColumnType {
  switch (type) {
    case "string":
    case "localeString":
      return "varchar"
    case "text":
      switch (dbEngine) {
        case "mysql":
        case "mariadb":
          return "longtext"
        default:
          return "text"
      }
    case "boolean":
      switch (dbEngine) {
        case "mysql":
          return "tinyint"
        case "postgres":
          return "bool"
        case "sqlite":
        case "sqljs":
        default:
          return "boolean"
      }
    case "int":
      return "int"
    case "float":
      return "double precision"
    case "datetime":
      switch (dbEngine) {
        case "postgres":
          return "timestamp"
        case "mysql":
        case "sqlite":
        case "sqljs":
        default:
          return "datetime"
      }
    default:
      break;
  }
  return "varchar"
}

function getDefault(customField: CustomField, dbEngine: ConnectionOptions["type"]) {
  const { type, list, defaultValue } = customField
  if (list && defaultValue) {
    if (dbEngine === "mysql") {
      return undefined
    }
    return JSON.stringify(defaultValue)
  }
  return type === "datetime" ? formatDefaultDatetime(dbEngine, defaultValue) : defaultValue
}

function formatDefaultDatetime(dbEngine: ConnectionOptions['type'], datetime: any): Date | string {
    if (!datetime) {
        return datetime;
    }
    switch (dbEngine) {
        case 'sqlite':
        case 'sqljs':
            return DateUtils.mixedDateToUtcDatetimeString(datetime);
        case 'mysql':
        case 'postgres':
        default:
            return DateUtils.mixedDateToUtcDatetimeString(datetime);
    }
}