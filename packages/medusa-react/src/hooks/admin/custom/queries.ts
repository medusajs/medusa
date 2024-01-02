import { Response } from "@medusajs/medusa-js"
import { QueryKey, useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"

/**
 * This hook sends a `GET` request to a custom API Route. The method accepts a tuple of type parameters: the first `TQuery` is the type of accepted query parameters,
 * which defaults to `Record<string, any>`; the second `TResponse` is the type of response, which defaults to `any`.
 * 
 * @example
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
 * @namespaceAsCategory Hooks.Admin.Custom
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
