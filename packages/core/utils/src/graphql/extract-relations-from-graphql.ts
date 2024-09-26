import { isListType, isNonNullType, isObjectType } from "graphql"

/**
 * Extracts only the relation fields from the GraphQL type map.
 * @param {Map<string, any>} typeMap - The GraphQL schema TypeMap.
 * @returns {Map<string, Map<string, string>>} A map where each key is an entity name, and the values are a map of relation fields and their corresponding entity type.
 */
export function extractRelationsFromGQL(
  typeMap: Map<string, any>
): Map<string, Map<string, string>> {
  const relationMap = new Map()

  // Extract the actual type
  const getBaseType = (type) => {
    if (isNonNullType(type) || isListType(type)) {
      return getBaseType(type.ofType)
    }
    return type
  }

  for (const [typeName, graphqlType] of Object.entries(typeMap)) {
    if (!isObjectType(graphqlType)) {
      continue
    }

    const fields = graphqlType.getFields()
    const entityRelations = new Map()

    for (const [fieldName, fieldConfig] of Object.entries(fields)) {
      const fieldType = getBaseType((fieldConfig as any).type)

      // only add relation fields
      if (isObjectType(fieldType)) {
        entityRelations.set(fieldName, fieldType.name)
      }
    }
    relationMap.set(typeName, entityRelations)
  }

  return relationMap
}
