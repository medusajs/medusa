import { mergeTypeDefs } from "@graphql-tools/merge"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { cleanGraphQLSchema } from "@medusajs/utils"

export function getEntitiesMap(loadedSchema): Map<string, any> {
  const defaultMedusaSchema = `
    scalar DateTime
    scalar JSON
  `
  const { schema } = cleanGraphQLSchema(defaultMedusaSchema + loadedSchema)
  const mergedSchema = mergeTypeDefs(schema)
  return makeExecutableSchema({ typeDefs: mergedSchema }).getTypeMap() as any
}
