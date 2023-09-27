import { GraphQLNamedType, GraphQLObjectType, isObjectType } from "graphql"

/**
 * From graphql schema get all the fields for the requested type and relations
 *
 * @param schemaTypeMap
 * @param typeName
 * @param relations
 *
 * @example
 *
 * const userModule = `
 * type User {
 *   id: ID!
 *   name: String!
 *   blabla: WHATEVER
 * }
 *
 * type Post {
 *   author: User!
 * }
 * `
 *
 * const postModule = `
 * type Post {
 *   id: ID!
 *   title: String!
 *   date: String
 * }
 *
 * type User {
 *   posts: [Post!]!
 * }
 *
 * type WHATEVER {
 *   random_field: String
 *   post: Post
 * }
 * `
 *
 * const fields = graphqlSchemaToFields(types, "User", ["posts"])
 *
 * console.log(fields)
 *
 * // [
 * //   "id",
 * //   "name",
 * //   "posts.id",
 * //   "posts.title",
 * //   "posts.date",
 * // ]
 */
export function graphqlSchemaToFields(
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
