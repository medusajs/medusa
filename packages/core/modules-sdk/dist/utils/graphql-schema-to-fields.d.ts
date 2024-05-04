import { GraphQLNamedType } from "graphql";
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
 * const mergedSchema = mergeTypeDefs([userModule, postModule])
 * const schema = makeExecutableSchema({
 *   typeDefs: mergedSchema,
 * })
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
export declare function graphqlSchemaToFields(schemaTypeMap: {
    [key: string]: GraphQLNamedType;
}, typeName: string, relations?: string[]): string[];
