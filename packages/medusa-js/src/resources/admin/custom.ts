import qs from "qs"
import { RequestOptions } from "../../request"
import { ResponsePromise } from "../../typings"
import { createAdminPath } from "../../utils"
import BaseResource from "../base"

/**
 * This class is used to send requests custom API Routes. All its method
 * are available in the JS Client under the `medusa.admin.custom` property.
 */
class AdminCustomResource extends BaseResource {
  /**
   * Send a `GET` request to a custom API Route. The method accepts a tuple of type parameters: the first `TQuery` is the type of accepted query parameters,
   * which defaults to `Record<string, any>`; the second `TResponse` is the type of response, which defaults to `any`.
   * @param {string} path - The path of the custom API Route.
   * @param {TQuery} query - Query path parameters to pass in the request.
   * @param {RequestOptions} options - Configurations to apply on the request.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<TResponse>} The response data.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * type PostsResponse = {
   * posts: Post[]
   * }
   * // must be previously logged in or use api token
   * medusa.admin.custom.get<Record<string, any>, PostsResponse>(
   *   "/blog/posts"
   * )
   * .then(({ posts }) => {
   *   console.log(posts.length);
   * })
   */
  get<TQuery extends Record<string, any>, TResponse = any>(
    path: string,
    query?: TQuery,
    options?: RequestOptions,
    customHeaders?: Record<string, any>
  ): ResponsePromise<TResponse> {
    let formattedPath = createAdminPath(path)

    if (query) {
      const queryString = qs.stringify(query)
      formattedPath += `?${queryString}`
    }

    return this.client.request(
      "GET",
      formattedPath,
      undefined,
      options,
      customHeaders
    )
  }

  /**
   * Send a `POST` request to a custom API Route. The method accepts a tuple of type parameters: the first `TPayload` is the type of accepted body parameters,
   * which defaults to `Record<string, any>`; the second `TResponse` is the type of response, which defaults to `any`.
   * @param {string} path - The path of the custom API Route.
   * @param {TPayload} payload - Body parameters to pass in the request.
   * @param {RequestOptions} options - Configurations to apply on the request.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<TResponse>} The response data.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * type PostRequest = {
   *   title: string
   * }
   * type PostResponse = {
   *   post: Post
   * }
   * // must be previously logged in or use api token
   * medusa.admin.custom.post<PostRequest, PostResponse>(
   *   "/blog/posts",
   *   {
   *     title: "My post",
   *   }
   * )
   * .then(({ post }) => {
   *   console.log(post.id);
   * })
   */
  post<TPayload extends Record<string, any>, TResponse = any>(
    path: string,
    payload?: TPayload,
    options?: RequestOptions,
    customHeaders?: Record<string, any>
  ): ResponsePromise<TResponse> {
    const formattedPath = createAdminPath(path)

    return this.client.request(
      "POST",
      formattedPath,
      payload,
      options,
      customHeaders
    )
  }

  /**
   * Send a `DELETE` request to a custom API Route. The method accepts a type parameters `TResponse` indicating the type of response, which defaults to `any`.
   * @param {string} path - The path of the custom API Route.
   * @param {RequestOptions} options - Configurations to apply on the request.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<TResponse>} The response data.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.custom.delete(
   *   `/blog/posts/${postId}`
   * )
   * .then(() => {
   *   // deleted successfully
   * })
   */
  delete<TResponse = any>(
    path: string,
    options?: RequestOptions,
    customHeaders?: Record<string, any>
  ): ResponsePromise<TResponse> {
    const formattedPath = createAdminPath(path)

    return this.client.request(
      "DELETE",
      formattedPath,
      undefined,
      options,
      customHeaders
    )
  }
}

export default AdminCustomResource
