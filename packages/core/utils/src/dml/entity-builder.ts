import { DmlEntity } from "./entity"
import { TextProperty } from "./properties/text"
import { EnumProperty } from "./properties/enum"
import { JSONProperty } from "./properties/json"
import { HasOne } from "./relations/has-one"
import { HasMany } from "./relations/has-many"
import { NumberProperty } from "./properties/number"
import { BooleanProperty } from "./properties/boolean"
import { BelongsTo } from "./relations/belongs-to"
import { DateTimeProperty } from "./properties/date-time"
import { ManyToMany } from "./relations/many-to-many"
import type {
  PropertyType,
  RelationshipOptions,
  RelationshipType,
} from "@medusajs/types"
import { NullableModifier } from "./properties/nullable"
import { IdProperty } from "./properties/id"

/**
 * The implicit properties added by EntityBuilder in every schema
 */
const IMPLICIT_PROPERTIES = ["created_at", "updated_at", "deleted_at"]

/**
 * Entity builder exposes the API to create an entity and define its
 * schema using the shorthand methods.
 */
export class EntityBuilder {
  #disallowImplicitProperties(schema: Record<string, any>) {
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
  define<
    Schema extends Record<string, PropertyType<any> | RelationshipType<any>>
  >(
    name: string,
    schema: Schema
  ): DmlEntity<
    Schema & {
      created_at: DateTimeProperty
      updated_at: DateTimeProperty
      deleted_at: NullableModifier<Date, DateTimeProperty>
    }
  > {
    this.#disallowImplicitProperties(schema)

    return new DmlEntity<any>(name, {
      ...schema,
      created_at: new DateTimeProperty(),
      updated_at: new DateTimeProperty(),
      deleted_at: new DateTimeProperty().nullable(),
    } as any)
  }

  /**
   * Define an id property. Id properties are marked
   * primary by default
   */
  id(options?: ConstructorParameters<typeof IdProperty>[0]) {
    return new IdProperty(options)
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
   * Define a numeric/integer column
   */
  number() {
    return new NumberProperty()
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
            pivotEntity?: () => DmlEntity<any>
          }
      )
  ) {
    return new ManyToMany<T>(entityBuilder, options || {})
  }
}

export const model = new EntityBuilder()
