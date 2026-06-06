import { RelationshipMetadata } from "@zjedene-medusa/types"
import { DmlEntity } from "../../entity"
import { HasMany, HasOne } from "../../relations"
import { ManyToMany as DmlManyToMany } from "../../relations/many-to-many"
import { parseEntityName } from "../entity-builder"

function defineRelationships(
  modelName: string,
  relationship: RelationshipMetadata,
  { relatedModelName }: { relatedModelName: string }
) {
  let extra: string | undefined
  const fieldName = relationship.name

  if (relationship.options?.mappedBy && HasOne.isHasOne(relationship)) {
    const otherSideFieldName = relationship.options.mappedBy
    extra = `extend type ${relatedModelName} {\n  ${otherSideFieldName}: ${modelName}!\n}`
  }

  let isArray = false

  if (
    HasMany.isHasMany(relationship) ||
    DmlManyToMany.isManyToMany(relationship)
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

  return defineRelationships(entityName, relationship, relatedEntityInfo)
}
