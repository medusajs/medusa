import { GraphQLNamedType, GraphQLObjectType, isObjectType } from "graphql"

export function getFieldsAndRelations(
  schemaTypeMap: { [key: string]: GraphQLNamedType },
  typeName: string,
  relations: string[] = []
) {
  const result: string[] = []

  function traverseFields(typeName, prefix) {
    const type = schemaTypeMap[typeName]

    if (!(type instanceof GraphQLObjectType)) {
      return
    }

    const fields = type.getFields()

    for (const fieldName in fields) {
      const field = fields[fieldName]
      let fieldType = field.type as any

      while (fieldType.ofType) {
        fieldType = fieldType.ofType
      }

      if (!isObjectType(fieldType)) {
        result.push(`${prefix}${fieldName}`)
      } else if (relations.includes(prefix + fieldName)) {
        traverseFields(fieldType.name, `${prefix}${fieldName}.`)
      }
    }
  }

  traverseFields(typeName, "")
  return result
}
