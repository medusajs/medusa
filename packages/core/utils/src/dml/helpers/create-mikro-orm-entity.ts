import type {
  EntityCascades,
  EntityConstructor,
  Infer,
  KnownDataTypes,
  PropertyMetadata,
  PropertyType,
  RelationshipMetadata,
  RelationshipType,
} from "@medusajs/types"
import {
  BeforeCreate,
  Entity,
  Enum,
  Filter,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import {
  camelToSnakeCase,
  createPsqlIndexStatementHelper,
  generateEntityId,
  isDefined,
  pluralize,
  toCamelCase,
} from "../../common"
import { upperCaseFirst } from "../../common/upper-case-first"
import {
  MikroOrmBigNumberProperty,
  mikroOrmSoftDeletableFilterOptions,
} from "../../dal"
import { DmlEntity } from "../entity"
import { HasMany } from "../relations/has-many"
import { HasOne } from "../relations/has-one"
import { ManyToMany as DmlManyToMany } from "../relations/many-to-many"

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
 * Factory function to create the mikro orm entity builder. The return
 * value is a function that can be used to convert DML entities
 * to Mikro ORM entities.
 */
export function createMikrORMEntity() {
  /**
   * Parses entity name and returns model and table name from
   * it
   */
  function parseEntityName(entityName: string) {
    /**
     * Table name is going to be the snake case version of the entity name.
     * Here we should preserve PG schema (if defined).
     *
     * For example: "platform.user" should stay as "platform.user"
     */
    const tableName = camelToSnakeCase(entityName)

    /**
     * Entity name is going to be the camelCase version of the
     * name defined by the user
     */
    const [pgSchema, ...rest] = tableName.split(".")
    return {
      tableName,
      modelName: upperCaseFirst(
        toCamelCase(rest.length ? rest.join("_") : pgSchema)
      ),
      pgSchema: rest.length ? pgSchema : undefined,
    }
  }

  /**
   * The following property is used to track many to many relationship
   * between two entities. It is needed because we have to mark one
   * of them as the owner of the relationship without exposing
   * any user land APIs to explicitly define an owner.
   *
   * The object contains values as follows.
   * - [modelName.relationship]: true // true means, it is already marked as owner
   *
   * Example:
   * - [user.teams]: true // the teams relationship on user is an owner
   * - [team.users] // cannot be an owner
   */
  // TODO: if we use the util toMikroOrmEntities then a new builder will be used each time, lets think about this. Currently if means that with many to many we need to use the same builder
  const MANY_TO_MANY_TRACKED_REALTIONS: Record<string, boolean> = {}

  /**
   * Defines a DML entity schema field as a Mikro ORM property
   */
  function defineProperty(
    MikroORMEntity: EntityConstructor<any>,
    field: PropertyMetadata
  ) {
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

    /**
     * Defining an enum property
     */
    if (field.dataType.name === "enum") {
      Enum({
        items: () => field.dataType.options!.choices,
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
     * Defining an id property
     */
    if (field.dataType.name === "id") {
      const IdDecorator = field.dataType.options?.primaryKey
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
      MikroORMEntity.prototype.generateId = function () {
        this.id = generateEntityId(this.id, field.dataType.options?.prefix)
      }

      /**
       * Execute hook via lifecycle decorators
       */
      BeforeCreate()(MikroORMEntity.prototype, "generateId")
      OnInit()(MikroORMEntity.prototype, "generateId")
      return
    }

    /**
     * Define rest of properties
     */
    const columnType = COLUMN_TYPES[field.dataType.name]
    const propertyType = PROPERTY_TYPES[field.dataType.name]

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

  /**
   * Prepares indexes for a given field
   */
  function applyIndexes(
    MikroORMEntity: EntityConstructor<any>,
    tableName: string,
    field: PropertyMetadata
  ) {
    field.indexes.forEach((index) => {
      const providerEntityIdIndexStatement = createPsqlIndexStatementHelper({
        tableName,
        columns: [field.fieldName],
        unique: index.type === "unique",
        where: "deleted_at IS NULL",
      })

      providerEntityIdIndexStatement.MikroORMIndex()(MikroORMEntity)
    })
  }

  /**
   * Defines has one relationship on the Mikro ORM entity.
   */
  function defineHasOneRelationship(
    MikroORMEntity: EntityConstructor<any>,
    relationship: RelationshipMetadata,
    { relatedModelName }: { relatedModelName: string },
    cascades: EntityCascades<string[]>
  ) {
    const shouldRemoveRelated = !!cascades.delete?.includes(relationship.name)

    OneToOne({
      entity: relatedModelName,
      nullable: relationship.nullable,
      mappedBy: relationship.mappedBy || camelToSnakeCase(MikroORMEntity.name),
      cascade: shouldRemoveRelated
        ? (["perist", "soft-remove"] as any)
        : undefined,
    })(MikroORMEntity.prototype, relationship.name)
  }

  /**
   * Defines has many relationship on the Mikro ORM entity
   */
  function defineHasManyRelationship(
    MikroORMEntity: EntityConstructor<any>,
    relationship: RelationshipMetadata,
    { relatedModelName }: { relatedModelName: string },
    cascades: EntityCascades<string[]>
  ) {
    const shouldRemoveRelated = !!cascades.delete?.includes(relationship.name)

    OneToMany({
      entity: relatedModelName,
      orphanRemoval: true,
      mappedBy: relationship.mappedBy || camelToSnakeCase(MikroORMEntity.name),
      cascade: shouldRemoveRelated
        ? (["perist", "soft-remove"] as any)
        : undefined,
    })(MikroORMEntity.prototype, relationship.name)
  }

  /**
   * Defines belongs to relationship on the Mikro ORM entity. The belongsTo
   * relationship inspects the related entity for the other side of
   * the relationship and then uses one of the following Mikro ORM
   * relationship.
   *
   * - OneToOne: When the other side uses "hasOne" with "owner: true"
   * - ManyToOne: When the other side uses "hasMany"
   */
  function defineBelongsToRelationship(
    MikroORMEntity: EntityConstructor<any>,
    relationship: RelationshipMetadata,
    relatedEntity: DmlEntity<
      Record<string, PropertyType<any> | RelationshipType<any>>
    >,
    { relatedModelName }: { relatedModelName: string }
  ) {
    const mappedBy =
      relationship.mappedBy || camelToSnakeCase(MikroORMEntity.name)
    const { schema: relationSchema, cascades: relationCascades } =
      relatedEntity.parse()

    const otherSideRelation = relationSchema[mappedBy]

    /**
     * In DML the relationships are cascaded from parent to child. A belongsTo
     * relationship is always a child, therefore we look at the parent and
     * define a onDelete: cascade when we are included in the delete
     * list of parent cascade.
     */
    const shouldCascade = relationCascades.delete?.includes(mappedBy)

    /**
     * Ensure the mapped by is defined as relationship on the other side
     */
    if (!otherSideRelation) {
      throw new Error(
        `Missing property "${mappedBy}" on "${relatedModelName}" entity. Make sure to define it as a relationship`
      )
    }

    function applyForeignKeyAssignationHooks(foreignKeyName: string) {
      const hookName = `assignRelationFromForeignKeyValue${foreignKeyName}`
      /**
       * Hook to handle foreign key assignation
       */
      MikroORMEntity.prototype[hookName] = function () {
        this[relationship.name] ??= this[foreignKeyName]
        this[foreignKeyName] ??= this[relationship.name]?.id
      }

      /**
       * Execute hook via lifecycle decorators
       */
      BeforeCreate()(MikroORMEntity.prototype, hookName)
      OnInit()(MikroORMEntity.prototype, hookName)
    }

    /**
     * Otherside is a has many. Hence we should defined a ManyToOne
     */
    if (
      otherSideRelation instanceof HasMany ||
      otherSideRelation instanceof DmlManyToMany
    ) {
      const foreignKeyName = camelToSnakeCase(`${relationship.name}Id`)

      ManyToOne({
        entity: relatedModelName,
        columnType: "text",
        mapToPk: true,
        fieldName: camelToSnakeCase(`${relationship.name}Id`),
        nullable: relationship.nullable,
        onDelete: shouldCascade ? "cascade" : undefined,
      })(MikroORMEntity.prototype, camelToSnakeCase(`${relationship.name}Id`))

      if (otherSideRelation instanceof DmlManyToMany) {
        // Fix many to many foreign key usage
        Property({
          columnType: "text",
          type: "string",
          persist: false,
        } as any)(MikroORMEntity.prototype, relationship.name)
      } else {
        // HasMany case
        ManyToOne({
          entity: relatedModelName,
          persist: false,
        })(MikroORMEntity.prototype, relationship.name)
      }

      applyForeignKeyAssignationHooks(foreignKeyName)
      return
    }

    /**
     * Otherside is a has one. Hence we should defined a OneToOne
     */
    if (otherSideRelation instanceof HasOne) {
      const foreignKeyName = camelToSnakeCase(`${relationship.name}Id`)

      OneToOne({
        entity: relatedModelName,
        nullable: relationship.nullable,
        mappedBy: mappedBy,
        owner: true,
        onDelete: shouldCascade ? "cascade" : undefined,
      })(MikroORMEntity.prototype, relationship.name)

      Property({ type: "string", columnType: "text", persist: false })(
        MikroORMEntity.prototype,
        foreignKeyName
      )

      applyForeignKeyAssignationHooks(foreignKeyName)
      return
    }

    /**
     * Other side is some unsupported data-type
     */
    throw new Error(
      `Invalid relationship reference for "${mappedBy}" on "${relatedModelName}" entity. Make sure to define a hasOne or hasMany relationship`
    )
  }

  /**
   * Defines a many to many relationship on the Mikro ORM entity
   */
  function defineManyToManyRelationship(
    MikroORMEntity: EntityConstructor<any>,
    relationship: RelationshipMetadata,
    relatedEntity: DmlEntity<
      Record<string, PropertyType<any> | RelationshipType<any>>
    >,
    {
      relatedModelName,
      pgSchema,
    }: { relatedModelName: string; pgSchema: string | undefined }
  ) {
    let mappedBy = relationship.mappedBy
    let inversedBy: undefined | string
    let pivotEntityName: undefined | string
    let pivotTableName: undefined | string

    /**
     * Validating other side of relationship when mapped by is defined
     */
    if (mappedBy) {
      const otherSideRelation = relatedEntity.parse().schema[mappedBy]
      if (!otherSideRelation) {
        throw new Error(
          `Missing property "${mappedBy}" on "${relatedModelName}" entity. Make sure to define it as a relationship`
        )
      }

      if (otherSideRelation instanceof DmlManyToMany === false) {
        throw new Error(
          `Invalid relationship reference for "${mappedBy}" on "${relatedModelName}" entity. Make sure to define a manyToMany relationship`
        )
      }

      /**
       * Check if the other side has defined a mapped by and if that
       * mapping is already tracked as the owner.
       *
       * - If yes, we will inverse our mapped by
       * - Otherwise, we will track ourselves as the owner.
       */
      if (
        otherSideRelation.parse(mappedBy).mappedBy &&
        MANY_TO_MANY_TRACKED_REALTIONS[`${relatedModelName}.${mappedBy}`]
      ) {
        inversedBy = mappedBy
        mappedBy = undefined
      } else {
        MANY_TO_MANY_TRACKED_REALTIONS[
          `${MikroORMEntity.name}.${relationship.name}`
        ] = true
      }
    }

    /**
     * Validating pivot entity when it is defined and computing
     * its name
     */
    if (relationship.options.pivotEntity) {
      if (typeof relationship.options.pivotEntity !== "function") {
        throw new Error(
          `Invalid pivotEntity reference for "${MikroORMEntity.name}.${relationship.name}". Make sure to define the pivotEntity using a factory function`
        )
      }

      const pivotEntity = relationship.options.pivotEntity()
      if (!(pivotEntity instanceof DmlEntity)) {
        throw new Error(
          `Invalid pivotEntity reference for "${MikroORMEntity.name}.${relationship.name}". Make sure to return a DML entity from the pivotEntity callback`
        )
      }

      pivotEntityName = parseEntityName(pivotEntity.parse().name).modelName
    }

    if (!pivotEntityName) {
      /**
       * Pivot table name is created as follows (when not explicitly provided)
       *
       * - Combining both the entity's names.
       * - Sorting them by alphabetical order
       * - Converting them from camelCase to snake_case.
       * - And finally pluralizing the second entity name.
       */
      pivotTableName =
        relationship.options.pivotTable ??
        [MikroORMEntity.name.toLowerCase(), relatedModelName.toLowerCase()]
          .sort()
          .map((token, index) => {
            if (index === 1) {
              return pluralize(camelToSnakeCase(token))
            }
            return camelToSnakeCase(token)
          })
          .join("_")
    }

    ManyToMany({
      entity: relatedModelName,
      ...(pivotTableName
        ? {
            pivotTable: pgSchema
              ? `${pgSchema}.${pivotTableName}`
              : pivotTableName,
          }
        : {}),
      ...(pivotEntityName ? { pivotEntity: pivotEntityName } : {}),
      ...(mappedBy ? { mappedBy: mappedBy as any } : {}),
      ...(inversedBy ? { inversedBy: inversedBy as any } : {}),
    })(MikroORMEntity.prototype, relationship.name)
  }

  /**
   * Defines a DML entity schema field as a Mikro ORM relationship
   */
  function defineRelationship(
    MikroORMEntity: EntityConstructor<any>,
    relationship: RelationshipMetadata,
    cascades: EntityCascades<string[]>
  ) {
    /**
     * We expect the relationship.entity to be a function that
     * lazily returns the related entity
     */
    const relatedEntity =
      typeof relationship.entity === "function"
        ? (relationship.entity() as unknown)
        : undefined

    /**
     * Since we don't type-check relationships, we should validate
     * them at runtime
     */
    if (!relatedEntity) {
      throw new Error(
        `Invalid relationship reference for "${MikroORMEntity.name}.${relationship.name}". Make sure to define the relationship using a factory function`
      )
    }

    /**
     * Ensure the return value is a DML entity instance
     */
    if (!(relatedEntity instanceof DmlEntity)) {
      throw new Error(
        `Invalid relationship reference for "${MikroORMEntity.name}.${relationship.name}". Make sure to return a DML entity from the relationship callback`
      )
    }

    const { modelName, tableName, pgSchema } = parseEntityName(
      relatedEntity.parse().name
    )
    const relatedEntityInfo = {
      relatedModelName: modelName,
      relatedTableName: tableName,
      pgSchema,
    }

    /**
     * Defining relationships
     */
    switch (relationship.type) {
      case "hasOne":
        defineHasOneRelationship(
          MikroORMEntity,
          relationship,
          relatedEntityInfo,
          cascades
        )
        break
      case "hasMany":
        defineHasManyRelationship(
          MikroORMEntity,
          relationship,
          relatedEntityInfo,
          cascades
        )
        break
      case "belongsTo":
        defineBelongsToRelationship(
          MikroORMEntity,
          relationship,
          relatedEntity,
          relatedEntityInfo
        )
        break
      case "manyToMany":
        defineManyToManyRelationship(
          MikroORMEntity,
          relationship,
          relatedEntity,
          relatedEntityInfo
        )
        break
    }
  }

  /**
   * A helper function to define a Mikro ORM entity from a
   * DML entity.
   */
  return function createEntity<T extends DmlEntity<any>>(entity: T): Infer<T> {
    class MikroORMEntity {}

    const { name, schema, cascades } = entity.parse()
    const { modelName, tableName } = parseEntityName(name)

    /**
     * Assigning name to the class constructor, so that it matches
     * the DML entity name
     */
    Object.defineProperty(MikroORMEntity, "name", {
      get: function () {
        return modelName
      },
    })

    /**
     * Processing schema fields
     */
    Object.entries(schema).forEach(([name, property]) => {
      const field = property.parse(name)

      if ("fieldName" in field) {
        defineProperty(MikroORMEntity, field)
        applyIndexes(MikroORMEntity, tableName, field)
      } else {
        defineRelationship(MikroORMEntity, field, cascades)
      }
    })

    /**
     * Converting class to a MikroORM entity
     */
    return Entity({ tableName })(
      Filter(mikroOrmSoftDeletableFilterOptions)(MikroORMEntity)
    ) as Infer<T>
  }
}

/**
 * Takes a DML entity and returns a Mikro ORM entity otherwise
 * return the input idempotently
 * @param entity
 */
export const toMikroORMEntity = <T>(
  entity: T
): T extends DmlEntity<infer Schema> ? EntityConstructor<Schema> : T => {
  let mikroOrmEntity: T | EntityConstructor<any> = entity

  if (DmlEntity.isDmlEntity(entity)) {
    mikroOrmEntity = createMikrORMEntity()(entity)
  }

  return mikroOrmEntity as T extends DmlEntity<infer Schema>
    ? EntityConstructor<Schema>
    : T
}

/**
 * Takes any DmlEntity or mikro orm entities and return mikro orm entities only.
 * This action is idempotent if non of the entities are DmlEntity
 * @param entities
 */
export const toMikroOrmEntities = function <T extends any[]>(entities: T) {
  const entityBuilder = createMikrORMEntity()

  return entities.map((entity) => {
    if (DmlEntity.isDmlEntity(entity)) {
      return entityBuilder(entity)
    }

    return entity
  }) as {
    [K in keyof T]: T[K] extends DmlEntity<any>
      ? EntityConstructor<Infer<T[K]>>
      : T[K]
  }
}
