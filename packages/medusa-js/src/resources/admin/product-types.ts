import {
  AdminGetProductTypesParams,
  AdminProductTypesDeleteRes,
  AdminProductTypesListRes,
  AdminProductTypesRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"
import {
  CreateProductType,
  UpdateProductType,
} from "@medusajs/medusa/dist/types/product-type"

class AdminProductTypesResource extends BaseResource {
  /**
   * @description Creates a product type.
   * @param payload
   * @param customHeaders
   * @returns Created product type.
   */
  create(
    payload: CreateProductType,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductTypesRes> {
    const path = `/admin/product-types`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description Updates a product type
   * @param id id of the product type to update.
   * @param payload update to apply to product type.
   * @param customHeaders
   * @returns the updated product type.
   */
  update(
    id: string,
    payload: UpdateProductType,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductTypesRes> {
    const path = `/admin/product-types/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description deletes a product type
   * @param id id of product type to delete.
   * @param customHeaders
   * @returns Deleted response
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductTypesDeleteRes> {
    const path = `/admin/product-types/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * @description get a product type
   * @param id id of the product type to retrieve.
   * @param customHeaders
   * @returns the product type with the given id
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductTypesRes> {
    const path = `/admin/product-types/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description Lists product types matching a query
   * @param query Query for searching product types
   * @param customHeaders
   * @returns a list of product types matching the query.
   */
  list(
    query?: AdminGetProductTypesParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductTypesListRes> {
    let path = `/admin/product-types`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminProductTypesResource
