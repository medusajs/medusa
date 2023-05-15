import qs from "qs"
import { ResponsePromise } from "../../typings"
import { createAdminPath } from "../../utils"
import BaseResource from "../base"

class AdminCustomResource extends BaseResource {
  /**
   *
   * @param path path to the custom endpoint
   * @param id id of the entity to retrieve
   * @param customHeaders
   * @returns
   */
  retrieve<TResponse = any>(
    path: string,
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<TResponse> {
    const formattedPath = createAdminPath(path, id)

    return this.client.request(
      "GET",
      formattedPath,
      undefined,
      {},
      customHeaders
    )
  }

  /**
   * @description Lists an entity
   * @param path path to the custom endpoint
   * @param query optional
   * @param customHeaders
   */
  list<TQuery extends Record<string, any> = {}, TResponse = any>(
    path: string,
    query?: TQuery,
    customHeaders: Record<string, any> = {}
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
      {},
      customHeaders
    )
  }

  create<TPayload extends Record<string, any> = {}, TResponse = any>(
    path: string,
    payload: TPayload,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<TResponse> {
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
   * @description Updates an entity
   * @param path path to the custom endpoint
   * @param payload update to apply to entity
   * @param customHeaders
   */
  update<TPayload extends Record<string, any> = {}, TResponse = any>(
    path: string,
    id: string,
    payload: TPayload,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<TResponse> {
    const formattedPath = createAdminPath(path, id)

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
  delete<TResponse = any>(
    path: string,
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<TResponse> {
    const formattedPath = createAdminPath(path, id)

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
