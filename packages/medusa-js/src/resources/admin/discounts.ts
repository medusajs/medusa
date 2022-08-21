import {
  AdminDiscountConditionsRes,
  AdminDiscountsDeleteRes,
  AdminDiscountsListRes,
  AdminDiscountsRes,
  AdminGetDiscountsDiscountConditionsConditionParams,
  AdminGetDiscountsParams,
  AdminPostDiscountsDiscountConditions,
  AdminPostDiscountsDiscountConditionsCondition,
  AdminPostDiscountsDiscountConditionsConditionParams,
  AdminPostDiscountsDiscountConditionsParams,
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
  addRegion(
    id: string,
    regionId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/regions/${regionId}`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * @description Creates discounts
   */
  create(
    payload: AdminPostDiscountsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description Updates discount
   */
  update(
    id: string,
    payload: AdminPostDiscountsDiscountReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description Creates a dynamic discount code
   */
  createDynamicCode(
    id: string,
    payload: AdminPostDiscountsDiscountDynamicCodesReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/dynamic-codes`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description Deletes a discount
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsDeleteRes> {
    const path = `/admin/discounts/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * @description Deletes a dynamic discount
   */
  deleteDynamicCode(
    id: string,
    code: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/dynamic-codes/${code}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * @description Retrieves a discount
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description Retrieves a discount by code
   */
  retrieveByCode(
    code: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/code/${code}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description Lists discounts
   */
  list(
    query?: AdminGetDiscountsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsListRes> {
    let path = `/admin/discounts`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/discounts?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description Removes a region from a discount
   */
  removeRegion(
    id: string,
    regionId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/regions/${regionId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * @description creates a discount condition
   */
  createCondition(
    discountId: string,
    payload: AdminPostDiscountsDiscountConditions,
    query: AdminPostDiscountsDiscountConditionsParams = {},
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsRes> {
    let path = `/admin/discounts/${discountId}/conditions`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/discounts/${discountId}/conditions?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description Updates a discount condition
   */
  updateCondition(
    discountId: string,
    conditionId: string,
    payload: AdminPostDiscountsDiscountConditionsCondition,
    query: AdminPostDiscountsDiscountConditionsConditionParams = {},
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsRes> {
    let path = `/admin/discounts/${discountId}/conditions/${conditionId}`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/discounts/${discountId}/conditions/${conditionId}?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description Removes a condition from a discount
   */
  deleteCondition(
    discountId: string,
    conditionId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsDeleteRes> {
    const path = `/admin/discounts/${discountId}/conditions/${conditionId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * @description Gets a condition from a discount
   */
  getCondition(
    discountId: string,
    conditionId: string,
    query?: AdminGetDiscountsDiscountConditionsConditionParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountConditionsRes> {
    let path = `/admin/discounts/${discountId}/conditions/${conditionId}`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/discounts/${discountId}/conditions/${conditionId}?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminDiscountsResource
