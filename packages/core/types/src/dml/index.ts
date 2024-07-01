export const IsDmlEntity = Symbol.for("isDmlEntity")

export type DMLSchema = Record<
  string,
  PropertyType<any> | RelationshipType<any>
>

export interface IDmlEntity<Schema extends DMLSchema> {
  [IsDmlEntity]: true
  schema: Schema
}

/**
 * The supported data types
 */
export type KnownDataTypes =
  | "text"
  | "boolean"
  | "enum"
  | "number"
  | "bigNumber"
  | "dateTime"
  | "array"
  | "json"
  | "id"

/**
 * List of available relationships at DML level
 */
export type RelationshipTypes =
  | "hasOne"
  | "hasMany"
  | "belongsTo"
  | "manyToMany"

/**
 * The meta-data returned by the property parse method
 */
export type PropertyMetadata = {
  fieldName: string
  defaultValue?: any
  nullable: boolean
  dataType: {
    name: KnownDataTypes
    options?: Record<string, any>
  }
  indexes: {
    name?: string
    type: "index" | "unique"
  }[]
  relationships: RelationshipMetadata[]
}

/**
 * Definition of a property type. It should have a parse
 * method to get the metadata and a type-only property
 * to get its static type
 */
export type PropertyType<T> = {
  $dataType: T
  parse(fieldName: string): PropertyMetadata
}

/**
 * Options accepted by all the relationships
 */
export type RelationshipOptions = {
  /**
   * The name of the relationship as defined
   * in the other data model. This is only required
   * by the `belongsTo` relationship method.
   */
  mappedBy?: string
} & Record<string, any>

/**
 * The meta-data returned by the relationship parse
 * method
 */
export type RelationshipMetadata = {
  name: string
  type: RelationshipTypes
  entity: unknown
  nullable: boolean
  mappedBy?: string
  options: Record<string, any>
}

/**
 * Definition of a relationship type. It should have a parse
 * method to get the metadata and a type-only property
 * to get its static type
 */
export type RelationshipType<T> = {
  $dataType: T
  type: RelationshipTypes
  parse(relationshipName: string): RelationshipMetadata
}

/**
 * A type-only representation of a MikroORM entity. Since we generate
 * entities on the fly, we need a way to represent a type-safe
 * constructor and its instance properties.
 */
export interface EntityConstructor<Props> extends Function {
  new (): Props
}

/**
 * From a IDmlEntity, infer the foreign keys name and type for belongsTo relation meaning hasOne and ManyToOne
 */
export type InferForeignKeys<T> = T extends IDmlEntity<infer Schema>
  ? {
      [K in keyof Schema as Schema[K] extends { type: infer Type }
        ? Type extends RelationshipTypes
          ? `${K & string}_id`
          : K
        : K]: Schema[K] extends { type: infer Type }
        ? Type extends RelationshipTypes
          ? string
          : Schema[K]
        : Schema[K]
    }
  : never

/**
 * Helper to infer the schema type of a DmlEntity
 */
export type Infer<T> = T extends IDmlEntity<infer Schema>
  ? EntityConstructor<
      {
        [K in keyof Schema]: Schema[K]["$dataType"] extends () => infer R
          ? Infer<R>
          : Schema[K]["$dataType"] extends (() => infer R) | null
          ? Infer<R> | null
          : Schema[K]["$dataType"]
      } & InferForeignKeys<T>
    >
  : never

/**
 * Extracts names of relationships from a schema
 */
export type ExtractEntityRelations<
  Schema extends Record<string, any>,
  OfType extends RelationshipTypes
> = {
  [K in keyof Schema & string]: Schema[K] extends RelationshipType<any>
    ? Schema[K] extends { type: OfType }
      ? K
      : never
    : never
}[keyof Schema & string][]

/**
 * The actions to cascade from a given entity to its
 * relationship.
 */
export type EntityCascades<Relationships> = {
  /**
   * The related models to delete when a record of this data model
   * is deleted.
   */
  delete?: Relationships
}

/**
 * Helper to infer the instance type of a IDmlEntity once converted as an Entity
 */
export type InferTypeOf<T extends IDmlEntity<any>> = InstanceType<Infer<T>>

/**
 * Used in the module sdk internal service to infer propert entity typings from DML
 */
export type InferEntityType<T extends any> = T extends IDmlEntity<any>
  ? InferTypeOf<T>
  : T

/**
 * Infer all indexable properties from a DML entity including inferred foreign keys and excluding relationship
 */
export type InferIndexableProperties<T> = keyof (T extends IDmlEntity<
  infer Schema
>
  ? {
      [K in keyof Schema as Schema[K] extends { type: infer Type }
        ? Type extends RelationshipTypes
          ? never
          : K
        : K]: string
    } & InferForeignKeys<T>
  : never)

export type EntityIndex<
  TSchema extends DMLSchema = DMLSchema,
  TWhere = string
> = {
  /**
   * The name of the index. If not provided,
   * Medusa generates the name.
   */
  name?: string
  /**
   * When enabled, a unique index is created on the specified
   * properties.
   */
  unique?: boolean
  /**
   * The list of properties to create the index on.
   */
  on: InferIndexableProperties<IDmlEntity<TSchema>>[]
  /**
   * Conditions to restrict which records are indexed.
   */
  where?: TWhere
}

export type SimpleQueryValue = string | number | boolean | null
export type NeQueryValue = { $ne: SimpleQueryValue }
export type QueryValue = SimpleQueryValue | NeQueryValue

export type QueryCondition<T extends DMLSchema = DMLSchema> = {
  [K in keyof IDmlEntity<T>["schema"]]?: T[K] extends object
    ? QueryValue
    : QueryCondition<T>
}
