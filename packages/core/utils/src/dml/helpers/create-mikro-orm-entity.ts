import {
  Enum,
  Entity,
  OneToMany,
  Property,
  OneToOne,
  ManyToMany,
  ManyToOne,
  Filter,
} from "@mikro-orm/core"
import { DmlEntity } from "../entity"
import {
  pluralize,
  camelToSnakeCase,
  createPsqlIndexStatementHelper,
} from "../../common"
import { upperCaseFirst } from "../../common/upper-case-first"
import type {
  Infer,
  PropertyType,
  EntityCascades,
  KnownDataTypes,
  PropertyMetadata,
  RelationshipType,
  EntityConstructor,
  RelationshipMetadata,
} from "../types"
import { DALUtils } from "../../bundles"
import { HasOne } from "../relations/has-one"
import { HasMany } from "../relations/has-many"
import { ManyToMany as DmlManyToMany } from "../relations/many-to-many"

/**
 * DML entity data types to PostgreSQL data types via
 * Mikro ORM.
 *
 * We remove "enum" type from here, because we use a dedicated
 * mikro orm decorator for that
 */
const COLUMN_TYPES: {
  [K in Exclude<KnownDataTypes, "enum">]: string
} = {
  boolean: "boolean",
  dateTime: "timestamptz",
  number: "integer",
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
  [K in Exclude<KnownDataTypes, "enum">]: string
} = {
  boolean: "boolean",
  dateTime: "date",
  number: "number",
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
   * The following property is used to track many to many relationship
   * between two entities. It is needed because we have to mark one
   * of them as the owner of the relationship without exposing
   * any user land APIs to explicitly define an owner.
   *
   * The object contains values as follows.
   * - [entityname.relationship]: true // true means, it is already marked as owner
   *
   * Example:
   * - [user.teams]: true // the teams relationship on user is an owner
   * - [team.users] // cannot be an owner
   */
  const MANY_TO_MANY_TRACKED_REALTIONS: Record<string, boolean> = {}

  /**
   * Defines a DML entity schema field as a Mikro ORM property
   */
  function defineProperty(
    MikroORMEntity: EntityConstructor<any>,
    field: PropertyMetadata
  ) {
    if (SPECIAL_PROPERTIES[field.fieldName]) {
      SPECIAL_PROPERTIES[field.fieldName](MikroORMEntity, field)
      return
    }

    /**
     * Defining an enum property
     */
    if (field.dataType.name === "enum") {
      Enum({
        items: () => field.dataType.options!.choices,
        nullable: field.nullable,
        default: field.defaultValue,
      })(MikroORMEntity.prototype, field.fieldName)
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
      default: field.defaultValue,
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
      const name =
        index.name || `IDX_${tableName}_${camelToSnakeCase(field.fieldName)}`

      const providerEntityIdIndexStatement = createPsqlIndexStatementHelper({
        name,
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
    relatedEntity: DmlEntity<
      Record<string, PropertyType<any> | RelationshipType<any>>
    >,
    cascades: EntityCascades<string[]>
  ) {
    const relatedModelName = upperCaseFirst(relatedEntity.name)
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
    relatedEntity: DmlEntity<
      Record<string, PropertyType<any> | RelationshipType<any>>
    >,
    cascades: EntityCascades<string[]>
  ) {
    const relatedModelName = upperCaseFirst(relatedEntity.name)
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
    >
  ) {
    const mappedBy =
      relationship.mappedBy || camelToSnakeCase(MikroORMEntity.name)
    const { schema: relationSchema, cascades: relationCascades } =
      relatedEntity.parse()

    const otherSideRelation = relationSchema[mappedBy]
    const relatedModelName = upperCaseFirst(relatedEntity.name)

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
        `Missing property "${mappedBy}" on "${relatedEntity.name}" entity. Make sure to define it as a relationship`
      )
    }

    /**
     * Otherside is a has many. Hence we should defined a ManyToOne
     */
    if (otherSideRelation instanceof HasMany) {
      ManyToOne({
        entity: relatedModelName,
        columnType: "text",
        mapToPk: true,
        fieldName: camelToSnakeCase(`${relationship.name}Id`),
        nullable: relationship.nullable,
        onDelete: shouldCascade ? "cascade" : undefined,
      })(MikroORMEntity.prototype, camelToSnakeCase(`${relationship.name}Id`))

      ManyToOne({
        entity: relatedModelName,
        persist: false,
      })(MikroORMEntity.prototype, relationship.name)
      return
    }

    /**
     * Otherside is a has one. Hence we should defined a OneToOne
     */
    if (otherSideRelation instanceof HasOne) {
      OneToOne({
        entity: relatedModelName,
        nullable: relationship.nullable,
        mappedBy: mappedBy,
        owner: true,
        onDelete: shouldCascade ? "cascade" : undefined,
      })(MikroORMEntity.prototype, relationship.name)
      return
    }

    /**
     * Other side is some unsupported data-type
     */
    throw new Error(
      `Invalid relationship reference for "${mappedBy}" on "${relatedEntity.name}" entity. Make sure to define a hasOne or hasMany relationship`
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
    cascades: EntityCascades<string[]>
  ) {
    const relatedModelName = upperCaseFirst(relatedEntity.name)
    let mappedBy = relationship.mappedBy
    let inversedBy: undefined | string

    /**
     * A consistent pivot table name is created by:
     *
     * - Combining both the entity's names.
     * - Sorting them by alphabetical order
     * - Converting them from camelCase to snake_case.
     * - And finally pluralizing the second entity name.
     */
    const pivotTableName = [
      MikroORMEntity.name.toLowerCase(),
      relatedEntity.name.toLowerCase(),
    ]
      .sort()
      .map((token, index) => {
        if (index === 1) {
          return pluralize(camelToSnakeCase(token))
        }
        return camelToSnakeCase(token)
      })
      .join("_")

    if (mappedBy) {
      const otherSideRelation = relatedEntity.parse().schema[mappedBy]
      if (!otherSideRelation) {
        throw new Error(
          `Missing property "${mappedBy}" on "${relatedEntity.name}" entity. Make sure to define it as a relationship`
        )
      }

      if (otherSideRelation instanceof DmlManyToMany === false) {
        throw new Error(
          `Invalid relationship reference for "${mappedBy}" on "${relatedEntity.name}" entity. Make sure to define a manyToMany relationship`
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

    ManyToMany({
      entity: relatedModelName,
      pivotTable: pivotTableName,
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

    /**
     * Defining relationships
     */
    switch (relationship.type) {
      case "hasOne":
        defineHasOneRelationship(
          MikroORMEntity,
          relationship,
          relatedEntity,
          cascades
        )
        break
      case "hasMany":
        defineHasManyRelationship(
          MikroORMEntity,
          relationship,
          relatedEntity,
          cascades
        )
        break
      case "belongsTo":
        defineBelongsToRelationship(MikroORMEntity, relationship, relatedEntity)
        break
      case "manyToMany":
        defineManyToManyRelationship(
          MikroORMEntity,
          relationship,
          relatedEntity,
          cascades
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

    const className = upperCaseFirst(name)
    const tableName = pluralize(camelToSnakeCase(className))

    /**
     * Assigning name to the class constructor, so that it matches
     * the DML entity name
     */
    Object.defineProperty(MikroORMEntity, "name", {
      get: function () {
        return className
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
      Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)(MikroORMEntity)
    ) as Infer<T>
  }
}
