import { Response } from "@medusajs/medusa-js"
import { QueryKey, useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"

/**
 * This hook sends a `GET` request to a custom API Route.
 *
 * @typeParam TQuery - The type of accepted query parameters which defaults to `Record<string, any>`.
 * @typeParam TResponse - The type of response which defaults to `any`.
 * @typeParamDefinition TQuery - The query parameters based on the type specified for `TQuery`.
 * @typeParamDefinition TResponse - The response based on the type specified for `TResponse`.
 *
 * @example
 * import React from "react"
 * import { useAdminCustomQuery } from "medusa-react"
 * import Post from "./models/Post"
 *
 * type RequestQuery = {
 *   title: string
 * }
 *
 * type ResponseData = {
 *   posts: Post
 * }
 *
 * const Custom = () => {
 *   const { data, isLoading } = useAdminCustomQuery
 *     <RequestQuery, ResponseData>(
 *       "/blog/posts",
 *       ["posts"],
 *       {
 *         title: "My post"
 *       }
 *     )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {data?.posts && !data.posts.length && (
 *         <span>No Post</span>
 *       )}
 *       {data?.posts && data.posts?.length > 0 && (
 *         <ul>
 *           {data.posts.map((post) => (
 *             <li key={post.id}>{post.title}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Custom
 *
 * @customNamespace Hooks.Admin.Custom
 * @category Mutations
 */
export const useAdminCustomQuery = <
  TQuery extends Record<string, any>,
  TResponse = any
>(
  /**
   * The path to the custom endpoint.
   */
  path: string,
  /**
   * A list of query keys, used to invalidate data.
   */
  queryKey: QueryKey,
  /**
   * Query parameters to pass to the request.
   */
  query?: TQuery,
  options?: UseQueryOptionsWrapper<
    Response<TResponse>,
    Error,
    (string | TQuery | QueryKey | undefined)[]
  >
) => {
  const { client } = useMedusa()

  const { data, ...rest } = useQuery(
    [path, query, queryKey],
    () => client.admin.custom.get<TQuery, TResponse>(path, query),
    options
  )

  return { data, ...rest } as const
}
