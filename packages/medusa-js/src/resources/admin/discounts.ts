import {
  AdminDiscountsDeleteRes,
  AdminDiscountsListRes,
  AdminDiscountsRes,
  AdminGetDiscountsParams,
  AdminPostDiscountsDiscountDynamicCodesReq,
  AdminPostDiscountsDiscountReq,
  AdminPostDiscountsReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminDiscountsResource extends BaseResource {
  /**
   * @description Adds region to discount
   */
  addRegion(id: string, regionId: string, customHeaders: Record<string, any> = {}): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/regions/${regionId}`
    return this.client.request("POST", path, {}, {}, customHeaders)
  }

  /**
   * @description Add valid product
   */
  addValidProduct(
    id: string,
    productId: string,
    customHeaders: Record<string, any> = {}): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/products/${productId}`
    return this.client.request("POST", path, {})
  }

  /**
   * @description Creates discounts
   */
  create(payload: AdminPostDiscountsReq, customHeaders: Record<string, any> = {}): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description Updates discount
   */
  update(
    id: string,
    payload: AdminPostDiscountsDiscountReq,
    customHeaders: Record<string, any> = {}): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description Creates a dynamic discount code
   */
  createDynamicCode(
    id: string,
    payload: AdminPostDiscountsDiscountDynamicCodesReq,
    customHeaders: Record<string, any> = {}): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/dynamic-codes`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description Deletes a discount
   */
  delete(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<AdminDiscountsDeleteRes> {
    const path = `/admin/discounts/${id}`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }

  /**
   * @description Deletes a dynamic discount
   */
  deleteDynamicCode(
    id: string,
    code: string,
    customHeaders: Record<string, any> = {}): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/dynamic-codes/${code}`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }

  /**
   * @description Retrieves a discount
   */
  retrieve(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  /**
   * @description Retrieves a discount by code
   */
  retrieveByCode(code: string, customHeaders: Record<string, any> = {}): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/code/${code}`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  /**
   * @description Lists discounts
   */
  list(
    query?: AdminGetDiscountsParams,
    customHeaders: Record<string, any> = {}): ResponsePromise<AdminDiscountsListRes> {
    let path = `/admin/discounts`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/discounts?${queryString}`
    }

    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  /**
   * @description Removes a region from a discount
   */
  removeRegion(
    id: string,
    regionId: string,
    customHeaders: Record<string, any> = {}): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/regions/${regionId}`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }

  /**
   * @description Removes a valid product from a discount
   */
  removeValidProduct(
    id: string,
    productId: string,
    customHeaders: Record<string, any> = {}): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/products/${productId}`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }
}

export default AdminDiscountsResource
