import {
  EntityCascades,
  EntityConstructor,
  PropertyType,
  RelationshipMetadata,
  RelationshipType,
} from "@medusajs/types"
import {
  BeforeCreate,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  OnInit,
  Property,
} from "@mikro-orm/core"
import { camelToSnakeCase, pluralize } from "../../../common"
import { ForeignKey } from "../../../dal/mikro-orm/decorators/foreign-key"
import { DmlEntity } from "../../entity"
import { HasMany } from "../../relations/has-many"
import { HasOne } from "../../relations/has-one"
import { ManyToMany as DmlManyToMany } from "../../relations/many-to-many"
import { parseEntityName } from "./parse-entity-name"

type Context = {
  MANY_TO_MANY_TRACKED_REALTIONS: Record<string, boolean>
}

/**
 * Defines has one relationship on the Mikro ORM entity.
 */
export function defineHasOneRelationship(
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
export function defineHasManyRelationship(
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
export function defineBelongsToRelationship(
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
    HasMany.isHasMany(otherSideRelation) ||
    DmlManyToMany.isManyToMany(otherSideRelation)
  ) {
    const foreignKeyName = camelToSnakeCase(`${relationship.name}Id`)

    ManyToOne({
      entity: relatedModelName,
      columnType: "text",
      mapToPk: true,
      fieldName: foreignKeyName,
      nullable: relationship.nullable,
      onDelete: shouldCascade ? "cascade" : undefined,
    })(MikroORMEntity.prototype, foreignKeyName)
    ForeignKey()(MikroORMEntity.prototype, foreignKeyName)

    if (DmlManyToMany.isManyToMany(otherSideRelation)) {
      Property({
        type: relatedModelName,
        persist: false,
        nullable: relationship.nullable,
      })(MikroORMEntity.prototype, relationship.name)
    } else {
      // HasMany case
      ManyToOne({
        entity: relatedModelName,
        persist: false,
        nullable: relationship.nullable,
      })(MikroORMEntity.prototype, relationship.name)
    }

    applyForeignKeyAssignationHooks(foreignKeyName)
    return
  }

  /**
   * Otherside is a has one. Hence we should defined a OneToOne
   */
  if (HasOne.isHasOne(otherSideRelation)) {
    const foreignKeyName = camelToSnakeCase(`${relationship.name}Id`)

    OneToOne({
      entity: relatedModelName,
      nullable: relationship.nullable,
      mappedBy: mappedBy,
      owner: true,
      onDelete: shouldCascade ? "cascade" : undefined,
    })(MikroORMEntity.prototype, relationship.name)

    if (relationship.nullable) {
      Object.defineProperty(MikroORMEntity.prototype, foreignKeyName, {
        value: null,
        configurable: true,
        enumerable: true,
        writable: true,
      })
    }

    Property({
      type: "string",
      columnType: "text",
      nullable: relationship.nullable,
    })(MikroORMEntity.prototype, foreignKeyName)
    ForeignKey()(MikroORMEntity.prototype, foreignKeyName)

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
export function defineManyToManyRelationship(
  MikroORMEntity: EntityConstructor<any>,
  relationship: RelationshipMetadata,
  relatedEntity: DmlEntity<
    Record<string, PropertyType<any> | RelationshipType<any>>
  >,
  {
    relatedModelName,
    pgSchema,
  }: { relatedModelName: string; pgSchema: string | undefined },
  { MANY_TO_MANY_TRACKED_REALTIONS }: Context
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

    if (!DmlManyToMany.isManyToMany(otherSideRelation)) {
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
    if (!DmlEntity.isDmlEntity(pivotEntity)) {
      throw new Error(
        `Invalid pivotEntity reference for "${MikroORMEntity.name}.${relationship.name}". Make sure to return a DML entity from the pivotEntity callback`
      )
    }

    pivotEntityName = parseEntityName(pivotEntity).modelName
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
export function defineRelationship(
  MikroORMEntity: EntityConstructor<any>,
  relationship: RelationshipMetadata,
  cascades: EntityCascades<string[]>,
  context: Context
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
  if (!DmlEntity.isDmlEntity(relatedEntity)) {
    throw new Error(
      `Invalid relationship reference for "${MikroORMEntity.name}.${relationship.name}". Make sure to return a DML entity from the relationship callback`
    )
  }

  const { modelName, tableName, pgSchema } = parseEntityName(relatedEntity)
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
        relatedEntityInfo,
        context
      )
      break
  }
}
