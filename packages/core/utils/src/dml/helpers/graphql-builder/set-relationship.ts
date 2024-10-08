import {
  PropertyType,
  RelationshipMetadata,
  RelationshipType,
} from "@medusajs/types"
import { camelToSnakeCase } from "../../../common"
import { DmlEntity } from "../../entity"
import { BelongsTo } from "../../relations/belongs-to"
import { HasMany } from "../../relations/has-many"
import { HasOne } from "../../relations/has-one"
import { ManyToMany as DmlManyToMany } from "../../relations/many-to-many"
import { parseEntityName } from "../entity-builder/parse-entity-name"

function defineRelationships(
  modelName: string,
  relationship: RelationshipMetadata,
  relatedEntity: DmlEntity<
    Record<string, PropertyType<any> | RelationshipType<any>>,
    any
  >,
  { relatedModelName }: { relatedModelName: string }
) {
  let extra: string | undefined
  const fieldName = relationship.name

  const mappedBy = relationship.mappedBy || camelToSnakeCase(modelName)
  const { schema: relationSchema } = relatedEntity.parse()

  const otherSideRelation = relationSchema[mappedBy]

  if (relationship.options?.mappedBy && HasOne.isHasOne(relationship)) {
    const otherSideFieldName = relationship.options.mappedBy
    extra = `extend type ${relatedModelName} {\n  ${otherSideFieldName}: ${modelName}!\n}`
  }

  let isArray = false

  /**
   * Otherside is a has many. Hence we should defined a ManyToOne
   */
  if (
    HasMany.isHasMany(otherSideRelation) ||
    DmlManyToMany.isManyToMany(relationship) ||
    (BelongsTo.isBelongsTo(otherSideRelation) &&
      HasMany.isHasMany(relationship))
  ) {
    isArray = true
  }

  return {
    attribute:
      `${fieldName}: ${isArray ? "[" : ""}${relatedModelName}${
        isArray ? "]" : ""
      }` + (relationship.nullable ? "" : "!"),
    extra,
  }
}

export function setGraphQLRelationship(
  entityName: string,
  relationship: RelationshipMetadata
): {
  extra?: string
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

  return defineRelationships(
    entityName,
    relationship,
    relatedEntity,
    relatedEntityInfo
  )
}
