import {
  EntityConstructor,
  KnownDataTypes,
  PropertyMetadata,
  PropertyType,
} from "@zjedene-medusa/types"
import {
  ArrayType,
  BeforeCreate,
  Enum,
  OnInit,
  PrimaryKey,
  Property,
  Utils,
} from "@zjedene-medusa/deps/mikro-orm/core"
import { generateEntityId, isDefined } from "../../../common"
import { MikroOrmBigNumberProperty } from "../../../dal"
import { PrimaryKeyModifier } from "../../properties/primary-key"
import { applyEntityIndexes } from "../mikro-orm/apply-indexes"

/**
 * DML entity data types to PostgreSQL data types via
 * Mikro ORM.
 *
 * We remove "enum" type from here, because we use a dedicated
 * mikro orm decorator for that
 */
const COLUMN_TYPES: {
  [K in Exclude<KnownDataTypes, "enum" | "id">]: string
} = {
  boolean: "boolean",
  dateTime: "timestamptz",
  number: "integer",
  bigNumber: "numeric",
  float: "real",
  serial: "number",
  text: "text",
  json: "jsonb",
  array: "array",
}

/**
 * DML entity data types to Mikro ORM property
 * types.
 *
 * We remove "enum" type from here, because we use a dedicated
 * mikro orm decorator for that
 */
const PROPERTY_TYPES: {
  [K in Exclude<KnownDataTypes, "enum" | "id">]: string
} = {
  boolean: "boolean",
  dateTime: "date",
  number: "number",
  bigNumber: "number",
  float: "number",
  serial: "number",
  text: "string",
  json: "any",
  array: "string[]",
}

/**
 * Properties that needs special treatment based upon their name.
 * We can safely rely on these names because they are never
 * provided by the end-user. Instead we output them
 * implicitly via the DML.
 */
const SPECIAL_PROPERTIES: {
  [propertyName: string]: (
    MikroORMEntity: EntityConstructor<any>,
    field: PropertyMetadata,
    tableName: string
  ) => void
} = {
  created_at: (MikroORMEntity, field) => {
    Property({
      columnType: "timestamptz",
      type: "date",
      nullable: false,
      fieldName: field.fieldName,
      defaultRaw: "now()",
      onCreate: () => new Date(),
    })(MikroORMEntity.prototype, field.fieldName)
  },
  updated_at: (MikroORMEntity, field) => {
    Property({
      columnType: "timestamptz",
      type: "date",
      nullable: false,
      fieldName: field.fieldName,
      defaultRaw: "now()",
      onCreate: () => new Date(),
      onUpdate: () => new Date(),
    })(MikroORMEntity.prototype, field.fieldName)
  },
  deleted_at: (MikroORMEntity, field, tableName) => {
    Property({
      columnType: "timestamptz",
      type: "date",
      nullable: true,
      fieldName: field.fieldName,
    })(MikroORMEntity.prototype, field.fieldName)

    applyEntityIndexes(MikroORMEntity, tableName, [
      {
        on: ["deleted_at"],
        where: "deleted_at IS NULL",
      },
    ])
  },
}

/**
 * Defines a DML entity schema field as a Mikro ORM property
 */
export function defineProperty(
  MikroORMEntity: EntityConstructor<any>,
  property: PropertyType<any>,
  { tableName, propertyName }: { tableName: string; propertyName: string }
) {
  const field = property.parse(propertyName)
  /**
   * Here we initialize all properties with their default values on before create
   * which means when persist is called but not necessarely flush
   */
  if (isDefined(field.defaultValue) || field.nullable) {
    const defaultValueSetterHookName = `${field.fieldName}_setDefaultValueOnBeforeCreate`
    MikroORMEntity.prototype[defaultValueSetterHookName] = function () {
      if (isDefined(field.defaultValue) && this[propertyName] === undefined) {
        this[propertyName] = field.defaultValue
        return
      }

      if (field.nullable && this[propertyName] === undefined) {
        this[propertyName] = null
        return
      }
    }
    BeforeCreate()(MikroORMEntity.prototype, defaultValueSetterHookName)
  }

  if (field.computed) {
    return
  }

  if (SPECIAL_PROPERTIES[field.fieldName]) {
    SPECIAL_PROPERTIES[field.fieldName](MikroORMEntity, field, tableName)
    return
  }

  if (field.dataType.name === "bigNumber") {
    /**
     * Defining an big number property
     * A big number property always comes with a raw_{{ fieldName }} column
     * where the config of the bigNumber is set.
     * The `raw_` field is generated during DML schema generation as a json
     * dataType.
     */
    MikroOrmBigNumberProperty({
      nullable: field.nullable,
      fieldName: field.fieldName,
      /**
       * MikroORM does not ignore undefined values for default when generating
       * the database schema SQL. Conditionally add it here to prevent undefined
       * from being set as default value in SQL.
       */
      ...(isDefined(field.defaultValue) && { default: field.defaultValue }),
    })(MikroORMEntity.prototype, field.fieldName)

    return
  }

  if (field.dataType.name === "array") {
    Property({
      type: ArrayType,
      fieldName: field.fieldName,
      nullable: field.nullable,
      /**
       * MikroORM does not ignore undefined values for default when generating
       * the database schema SQL. Conditionally add it here to prevent undefined
       * from being set as default value in SQL.
       */
      ...(isDefined(field.defaultValue) && { default: field.defaultValue }),
    })(MikroORMEntity.prototype, field.fieldName)

    return
  }

  /**
   * Defining an enum property
   */
  if (field.dataType.name === "enum") {
    Enum({
      items: () => field.dataType.options!.choices,
      nullable: field.nullable,
      fieldName: field.fieldName,
      type: Utils.getObjectType(field.dataType.options!.choices[0]),
      /**
       * MikroORM does not ignore undefined values for default when generating
       * the database schema SQL. Conditionally add it here to prevent undefined
       * from being set as default value in SQL.
       */
      ...(isDefined(field.defaultValue) && { default: field.defaultValue }),
    })(MikroORMEntity.prototype, field.fieldName)

    return
  }

  /**
   * Defining an id property
   */
  if (field.dataType.name === "id") {
    const Prop = PrimaryKeyModifier.isPrimaryKeyModifier(property)
      ? PrimaryKey
      : Property

    const IdDecorator = Prop({
      columnType: "text",
      type: "string",
      nullable: false,
      fieldName: field.fieldName,
    })

    IdDecorator(MikroORMEntity.prototype, field.fieldName)

    /**
     * Hook to generate entity within the code
     */
    const generateIdMethodName = `generateId`
    MikroORMEntity.prototype[generateIdMethodName] = function () {
      this[field.fieldName] = generateEntityId(
        this[field.fieldName],
        field.dataType.options?.prefix
      )
    }

    /**
     * Execute hook via lifecycle decorators
     */
    BeforeCreate()(MikroORMEntity.prototype, generateIdMethodName)
    OnInit()(MikroORMEntity.prototype, generateIdMethodName)

    return
  }

  /**
   * Handling JSON property separately to stringify its default value
   */
  if (field.dataType.name === "json") {
    Property({
      columnType: "jsonb",
      type: "any",
      nullable: field.nullable,
      fieldName: field.fieldName,
      /**
       * MikroORM does not ignore undefined values for default when generating
       * the database schema SQL. Conditionally add it here to prevent undefined
       * from being set as default value in SQL.
       */
      ...(isDefined(field.defaultValue) && {
        default: JSON.stringify(field.defaultValue),
      }),
    })(MikroORMEntity.prototype, field.fieldName)
    return
  }

  /**
   * Handling serial property separately to set the column type
   */
  if (field.dataType.name === "serial") {
    const Prop = PrimaryKeyModifier.isPrimaryKeyModifier(property)
      ? PrimaryKey
      : Property

    Prop({
      autoincrement: true,
      type: "number",
      runtimeType: "number",
      nullable: field.nullable,
      fieldName: field.fieldName,
      serializer: (value) => (value == null ? value : Number(value)),
    })(MikroORMEntity.prototype, field.fieldName)
    return
  }

  /**
   * Handling serial property separately to set the column type
   */
  if (field.dataType.name === "float") {
    Property({
      columnType: "real",
      type: "number",
      runtimeType: "number",
      nullable: field.nullable,
      fieldName: field.fieldName,
      /**
       * Applying number serializer to convert value back to a
       * JavaScript number
       */
      serializer: (value) => (value == null ? value : Number(value)),
      /**
       * MikroORM does not ignore undefined values for default when generating
       * the database schema SQL. Conditionally add it here to prevent undefined
       * from being set as default value in SQL.
       */
      ...(isDefined(field.defaultValue) && { default: field.defaultValue }),
    })(MikroORMEntity.prototype, field.fieldName)

    return
  }

  /**
   * Define rest of properties
   */
  const columnType = COLUMN_TYPES[field.dataType.name]
  const propertyType = PROPERTY_TYPES[field.dataType.name]

  /**
   * Defining a primary key property
   */
  if (PrimaryKeyModifier.isPrimaryKeyModifier(property)) {
    PrimaryKey({
      columnType,
      type: propertyType,
      nullable: false,
      fieldName: field.fieldName,
    })(MikroORMEntity.prototype, field.fieldName)

    return
  }

  Property({
    columnType,
    type: propertyType,
    nullable: field.nullable,
    fieldName: field.fieldName,
    /**
     * MikroORM does not ignore undefined values for default when generating
     * the database schema SQL. Conditionally add it here to prevent undefined
     * from being set as default value in SQL.
     */
    ...(isDefined(field.defaultValue) && { default: field.defaultValue }),
  })(MikroORMEntity.prototype, field.fieldName)
}
