import { GraphQLUtils } from "@medusajs/utils"

export function getEntitiesMap(loadedSchema): Map<string, any> {
  const defaultMedusaSchema = `
    scalar DateTime
    scalar JSON
  `
  const { schema } = GraphQLUtils.cleanGraphQLSchema(
    defaultMedusaSchema + loadedSchema
  )
  const mergedSchema = GraphQLUtils.mergeTypeDefs(schema)
  return GraphQLUtils.makeExecutableSchema({
    typeDefs: mergedSchema,
  }).getTypeMap() as any
}
