import qs from "qs"
import { RequestOptions } from "../../request"
import { ResponsePromise } from "../../typings"
import { createAdminPath } from "../../utils"
import BaseResource from "../base"

class AdminCustomResource extends BaseResource {
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
