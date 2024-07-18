import {
  EntityConstructor,
  KnownDataTypes,
  PropertyMetadata,
  PropertyType,
} from "@medusajs/types"
import { MikroOrmBigNumberProperty } from "../../../dal"
import { generateEntityId, isDefined } from "../../../common"
import {
  ArrayType,
  BeforeCreate,
  Enum,
  OnInit,
  PrimaryKey,
  Property,
  Utils,
} from "@mikro-orm/core"
import { PrimaryKeyModifier } from "../../properties/primary-key"

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
    field: PropertyMetadata
  ) => void
} = {
  created_at: (MikroORMEntity, field) => {
    Property({
      columnType: "timestamptz",
      type: "date",
      nullable: false,
      defaultRaw: "now()",
      onCreate: () => new Date(),
    })(MikroORMEntity.prototype, field.fieldName)
  },
  updated_at: (MikroORMEntity, field) => {
    Property({
      columnType: "timestamptz",
      type: "date",
      nullable: false,
      defaultRaw: "now()",
      onCreate: () => new Date(),
      onUpdate: () => new Date(),
    })(MikroORMEntity.prototype, field.fieldName)
  },
}

/**
 * Defines a DML entity schema field as a Mikro ORM property
 */
export function defineProperty(
  MikroORMEntity: EntityConstructor<any>,
  propertyName: string,
  property: PropertyType<any>
) {
  const field = property.parse(propertyName)
  /**
   * Here we initialize nullable properties with a null value
   */
  if (field.nullable) {
    Object.defineProperty(MikroORMEntity.prototype, field.fieldName, {
      value: null,
      configurable: true,
      enumerable: true,
      writable: true,
    })
  }

  if (SPECIAL_PROPERTIES[field.fieldName]) {
    SPECIAL_PROPERTIES[field.fieldName](MikroORMEntity, field)
    return
  }

  /**
   * Defining an big number property
   * A big number property always comes with a raw_{{ fieldName }} column
   * where the config of the bigNumber is set.
   * The `raw_` field is generated during DML schema generation as a json
   * dataType.
   */
  if (field.dataType.name === "bigNumber") {
    MikroOrmBigNumberProperty({
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

  if (field.dataType.name === "array") {
    Property({
      type: ArrayType,
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
    const IdDecorator = PrimaryKeyModifier.isPrimaryKeyModifier(property)
      ? PrimaryKey({
          columnType: "text",
          type: "string",
          nullable: false,
        })
      : Property({
          columnType: "text",
          type: "string",
          nullable: false,
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
    })(MikroORMEntity.prototype, field.fieldName)

    return
  }

  Property({
    columnType,
    type: propertyType,
    nullable: field.nullable,
    /**
     * MikroORM does not ignore undefined values for default when generating
     * the database schema SQL. Conditionally add it here to prevent undefined
     * from being set as default value in SQL.
     */
    ...(isDefined(field.defaultValue) && { default: field.defaultValue }),
  })(MikroORMEntity.prototype, field.fieldName)
}
