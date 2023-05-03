import qs from "qs"
import { ResponsePromise } from "../../typings"
import { createAdminPath } from "../../utils"
import BaseResource from "../base"

class AdminCustomResource extends BaseResource {
  /**
   * @description Retrieves an entity
   * @param path path to the custom endpoint
   * @param payload optional
   * @param customHeaders
   */
  get<Params extends Record<string, unknown> = {}, Response = any>(
    path: string,
    query?: Params,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<Response> {
    let formattedPath = createAdminPath(path)

    if (query) {
      const queryString = qs.stringify(query)
      formattedPath += `?${queryString}`
    }

    return this.client.request(
      "GET",
      formattedPath,
      undefined,
      {},
      customHeaders
    )
  }

  /**
   * @description Updates an entity
   * @param path path to the custom endpoint
   * @param payload update to apply to entity
   * @param customHeaders
   */
  post<Payload extends Record<string, unknown>, Response = any>(
    path: string,
    payload: Payload,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<Response> {
    const formattedPath = createAdminPath(path)

    return this.client.request(
      "POST",
      formattedPath,
      payload,
      {},
      customHeaders
    )
  }

  /**
   * @param path path to the custom endpoint
   * @param identifier the id or identifier of choice of the entity to delete
   * @param customHeaders
   */
  delete(
    path: string,
    identifier: any,
    customHeaders: Record<string, any> = {}
  ) {
    const formattedPath = `${createAdminPath(path)}/${identifier}`

    return this.client.request(
      "DELETE",
      formattedPath,
      undefined,
      {},
      customHeaders
    )
  }
}

export default AdminCustomResource
