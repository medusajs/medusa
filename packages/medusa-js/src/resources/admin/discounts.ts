import {
  AdminDiscountsDeleteRes,
  AdminDiscountsListRes,
  AdminDiscountsRes,
  AdminGetDiscountsParams,
  AdminPostDiscountsDiscountDynamicCodesReq,
  AdminPostDiscountsDiscountReq,
  AdminPostDiscountsReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminDiscountsResource extends BaseResource {
  /**
   * @description Adds region to discount
   */
  addRegion(id: string, regionId: string): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/regions/${regionId}`
    return this.client.request("POST", path, {})
  }

  /**
   * @description Add valid product
   */
  addValidProduct(
    id: string,
    productId: string
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/products/${productId}`
    return this.client.request("POST", path, {})
  }

  /**
   * @description Creates discounts
   */
  create(payload: AdminPostDiscountsReq): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description Updates discount
   */
  update(
    id: string,
    payload: AdminPostDiscountsDiscountReq
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description Creates a dynamic discount code
   */
  createDynamicCode(
    id: string,
    payload: AdminPostDiscountsDiscountDynamicCodesReq
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/dynamic-codes`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description Deletes a discount
   */
  delete(id: string): ResponsePromise<AdminDiscountsDeleteRes> {
    const path = `/admin/discounts/${id}`
    return this.client.request("DELETE", path)
  }

  /**
   * @description Deletes a dynamic discount
   */
  deleteDynamicCode(
    id: string,
    code: string
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/dynamic-codes/${code}`
    return this.client.request("DELETE", path)
  }

  /**
   * @description Retrieves a discount
   */
  retrieve(id: string): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}`
    return this.client.request("GET", path)
  }

  /**
   * @description Retrieves a discount by code
   */
  retrieveByCode(code: string): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/code/${code}`
    return this.client.request("GET", path)
  }

  /**
   * @description Lists discounts
   */
  list(
    query?: AdminGetDiscountsParams
  ): ResponsePromise<AdminDiscountsListRes> {
    let path = `/admin/discounts`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return `${key}=${value}`
      })

      path = `/admin/discounts?${queryString.join("&")}`
    }

    return this.client.request("GET", path)
  }

  /**
   * @description Removes a region from a discount
   */
  removeRegion(
    id: string,
    regionId: string
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/regions/${regionId}`
    return this.client.request("DELETE", path)
  }

  /**
   * @description Removes a valid product from a discount
   */
  removeValidProduct(
    id: string,
    productId: string
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/products/${productId}`
    return this.client.request("DELETE", path)
  }
}

export default AdminDiscountsResource
