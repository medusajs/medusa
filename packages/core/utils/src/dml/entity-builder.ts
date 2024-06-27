import {
  DMLSchema,
  IDmlEntityConfig,
  RelationshipOptions,
} from "@medusajs/types"
import { DmlEntity } from "./entity"
import { createBigNumberProperties } from "./helpers/entity-builder/create-big-number-properties"
import { createDefaultProperties } from "./helpers/entity-builder/create-default-properties"
import { inferPrimaryKeyProperties } from "./helpers/entity-builder/infer-primary-key-properties"
import { ArrayProperty } from "./properties/array"
import { BigNumberProperty } from "./properties/big-number"
import { BooleanProperty } from "./properties/boolean"
import { DateTimeProperty } from "./properties/date-time"
import { EnumProperty } from "./properties/enum"
import { IdProperty } from "./properties/id"
import { JSONProperty } from "./properties/json"
import { NumberProperty } from "./properties/number"
import { TextProperty } from "./properties/text"
import { BelongsTo } from "./relations/belongs-to"
import { HasMany } from "./relations/has-many"
import { HasOne } from "./relations/has-one"
import { ManyToMany } from "./relations/many-to-many"
import { PrimaryKeyModifier } from "./properties/primary-key"

/**
 * The implicit properties added by EntityBuilder in every schema
 */
const IMPLICIT_PROPERTIES = ["created_at", "updated_at", "deleted_at"]

/**
 * Entity builder exposes the API to create an entity and define its
 * schema using the shorthand methods.
 */
export class EntityBuilder {
  #disallowImplicitProperties(schema: DMLSchema) {
    const implicitProperties = Object.keys(schema).filter((fieldName) =>
      IMPLICIT_PROPERTIES.includes(fieldName)
    )

    if (implicitProperties.length) {
      throw new Error(
        `Cannot define field(s) "${implicitProperties.join(
          ","
        )}" as they are implicitly defined on every model`
      )
    }
  }

  /**
   * Define an entity or a model. The name should be unique across
   * all the entities.
   */
  define<Schema extends DMLSchema, TConfig extends IDmlEntityConfig>(
    nameOrConfig: TConfig,
    schema: Schema
  ) {
    this.#disallowImplicitProperties(schema)
    schema = inferPrimaryKeyProperties(schema)

    return new DmlEntity<Schema, TConfig>(nameOrConfig, {
      ...schema,
      ...createBigNumberProperties(schema),
      ...createDefaultProperties(),
    })
  }

  /**
   * Define an id property. Id properties are marked
   * primary by default
   */
  id<T extends { primaryKey?: boolean; prefix?: string } | undefined>(
    options?: T
  ): T extends undefined
    ? PrimaryKeyModifier<string, IdProperty>
    : T extends {
        primaryKey: infer PrimaryKeyBoolean
      }
    ? PrimaryKeyBoolean extends undefined
      ? PrimaryKeyModifier<string, IdProperty>
      : PrimaryKeyBoolean extends true
      ? PrimaryKeyModifier<string, IdProperty>
      : IdProperty
    : never {
    const { primaryKey = true, ...rest } = options ?? {}

    if (primaryKey) {
      return new IdProperty(rest).primaryKey(true) as any
    }

    return new IdProperty(options) as any
  }

  /**
   * Define a text/string based column
   */
  text() {
    return new TextProperty()
  }

  /**
   * Define a boolean column
   */
  boolean() {
    return new BooleanProperty()
  }

  /**
   * Define an integer column
   */
  number() {
    return new NumberProperty()
  }

  /**
   * Define a numeric column. This property produces an additional
   * column - raw_{{ property_name }}, which stores the configuration
   * of bignumber (https://github.com/MikeMcl/bignumber.js)
   */
  bigNumber() {
    return new BigNumberProperty()
  }

  /**
   * Define an array column
   */
  array() {
    return new ArrayProperty()
  }

  /**
   * Define a timestampz column
   */
  dateTime() {
    return new DateTimeProperty()
  }

  /**
   * Define a JSON column to store data as a
   * JSON string
   */
  json() {
    return new JSONProperty()
  }

  /**
   * Define an enum column where only a pre-defined set
   * of values are allowed.
   */
  enum<const Values extends unknown>(values: Values[]) {
    return new EnumProperty<Values>(values)
  }

  /**
   * Has one relationship defines a relationship between two entities
   * where the owner of the relationship has exactly one instance
   * of the related entity.
   *
   * For example: A user "hasOne" profile
   *
   * You may use the "belongsTo" relationship to define the inverse
   * of the "hasOne" relationship
   */
  hasOne<T>(entityBuilder: T, options?: RelationshipOptions) {
    return new HasOne<T>(entityBuilder, options || {})
  }

  /**
   * Define inverse of "hasOne" and "hasMany" relationship.
   */
  belongsTo<T>(entityBuilder: T, options?: RelationshipOptions) {
    return new BelongsTo<T>(entityBuilder, options || {})
  }

  /**
   * Has many relationship defines a relationship between two entities
   * where the owner of the relationship has many instance of the
   * related entity.
   *
   * For example:
   *
   * - A user "hasMany" books
   * - A user "hasMany" addresses
   */
  hasMany<T>(entityBuilder: T, options?: RelationshipOptions) {
    return new HasMany<T>(entityBuilder, options || {})
  }

  /**
   * ManyToMany relationship defines a relationship between two entities
   * where the owner of the relationship has many instance of the
   * related entity via a pivot table.
   *
   * For example:
   *
   * - A user has many teams. But a team has many users as well. So this
   *   relationship requires a pivot table to establish a many to many
   *   relationship between two entities
   */
  manyToMany<T>(
    entityBuilder: T,
    options?: RelationshipOptions &
      (
        | {
            pivotTable?: string
            pivotEntity?: never
          }
        | {
            pivotTable?: never
            pivotEntity?: () => DmlEntity<any, any>
          }
      )
  ) {
    return new ManyToMany<T>(entityBuilder, options || {})
  }
}

export const model = new EntityBuilder()
