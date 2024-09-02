import {
  PropertyType,
  RelationshipMetadata,
  RelationshipType,
} from "@medusajs/types"
import { camelToSnakeCase, pluralize } from "../../../common"
import { DmlEntity } from "../../entity"
import { HasMany } from "../../relations/has-many"
import { HasOne } from "../../relations/has-one"
import { ManyToMany as DmlManyToMany } from "../../relations/many-to-many"
import { parseEntityName } from "../entity-builder/parse-entity-name"

type Context = {
  MANY_TO_MANY_TRACKED_RELATIONS: Record<string, boolean>
}

export function defineHasOneRelationship(
  relationship: RelationshipMetadata,
  { relatedModelName }: { relatedModelName: string }
) {
  const fieldName = relationship.name
  return {
    attribute:
      `${fieldName}: ${relatedModelName}` + (relationship.nullable ? "" : "!"),
  }
}

export function defineHasManyRelationship(
  relationship: RelationshipMetadata,
  { relatedModelName }: { relatedModelName: string }
) {
  const fieldName = relationship.name
  return {
    attribute:
      `${fieldName}: [${relatedModelName}]` +
      (relationship.nullable ? "" : "!"),
  }
}

export function defineBelongsToRelationship(
  modelName: string,
  relationship: RelationshipMetadata,
  relatedEntity: DmlEntity<
    Record<string, PropertyType<any> | RelationshipType<any>>,
    any
  >,
  { relatedModelName }: { relatedModelName: string }
) {
  const fieldName = relationship.name

  const mappedBy = relationship.mappedBy || camelToSnakeCase(modelName)
  const { schema: relationSchema, cascades: relationCascades } =
    relatedEntity.parse()

  const otherSideRelation = relationSchema[mappedBy]
  let isArray = HasOne.isHasOne(otherSideRelation)

  /**
   * Otherside is a has many. Hence we should defined a ManyToOne
   */
  if (
    HasMany.isHasMany(otherSideRelation) ||
    DmlManyToMany.isManyToMany(otherSideRelation)
  ) {
    isArray = true
  }

  return {
    attribute:
      `${fieldName}: ${isArray ? "[" : ""}${relatedModelName}${
        isArray ? "]" : ""
      }` + (relationship.nullable ? "" : "!"),
  }
}

/**
 * Defines a many to many relationship on the Mikro ORM entity
 */
export function defineManyToManyRelationship(
  modelName: string,
  relationship: RelationshipMetadata,
  relatedEntity: DmlEntity<
    Record<string, PropertyType<any> | RelationshipType<any>>,
    any
  >,
  {
    relatedModelName,
    pgSchema,
  }: { relatedModelName: string; pgSchema: string | undefined },
  { MANY_TO_MANY_TRACKED_RELATIONS }: Context
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
      MANY_TO_MANY_TRACKED_RELATIONS[`${relatedModelName}.${mappedBy}`]
    ) {
      inversedBy = mappedBy
      mappedBy = undefined
    } else {
      MANY_TO_MANY_TRACKED_RELATIONS[`${modelName}.${relationship.name}`] = true
    }
  }

  /**
   * Validating pivot entity when it is defined and computing
   * its name
   */
  if (relationship.options.pivotEntity) {
    if (typeof relationship.options.pivotEntity !== "function") {
      throw new Error(
        `Invalid pivotEntity reference for "${modelName}.${relationship.name}". Make sure to define the pivotEntity using a factory function`
      )
    }

    const pivotEntity = relationship.options.pivotEntity()
    if (!DmlEntity.isDmlEntity(pivotEntity)) {
      throw new Error(
        `Invalid pivotEntity reference for "${modelName}.${relationship.name}". Make sure to return a DML entity from the pivotEntity callback`
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
      [modelName.toLowerCase(), relatedModelName.toLowerCase()]
        .sort()
        .map((token, index) => {
          if (index === 1) {
            return pluralize(camelToSnakeCase(token))
          }
          return camelToSnakeCase(token)
        })
        .join("_")
  }

  return {
    attribute:
      `${relationship.name}: [${relatedModelName}]` +
      (relationship.nullable ? "" : "!"),
    pivotSchema: pivotTableName
      ? `type ${pivotTableName} {
  ${camelToSnakeCase(modelName)}_id: String
  ${camelToSnakeCase(relatedModelName)}_id: String
}`
      : undefined,
  }
}

export function setGraphQLRelationship(
  entityName: string,
  relationship: RelationshipMetadata,
  context: Context
): {
  pivotSchema?: string
  attribute: string
} {
  const relatedEntity =
    typeof relationship.entity === "function"
      ? (relationship.entity() as unknown)
      : undefined

  if (!relatedEntity) {
    throw new Error(
      `Invalid relationship reference for "${entityName}.${relationship.name}". Make sure to define the relationship using a factory function`
    )
  }

  if (!DmlEntity.isDmlEntity(relatedEntity)) {
    throw new Error(
      `Invalid relationship reference for "${entityName}.${relationship.name}". Make sure to return a DML entity from the relationship callback`
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
      return defineHasOneRelationship(relationship, relatedEntityInfo)
    case "hasMany":
      return defineHasManyRelationship(relationship, relatedEntityInfo)
    case "belongsTo":
      return defineBelongsToRelationship(
        entityName,
        relationship,
        relatedEntity,
        relatedEntityInfo
      )
    case "manyToMany":
      return defineManyToManyRelationship(
        entityName,
        relationship,
        relatedEntity,
        relatedEntityInfo,
        context
      )
  }
}
