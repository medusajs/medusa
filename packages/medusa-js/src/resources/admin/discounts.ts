import {
  AdminDiscountsDeleteRes,
  AdminDiscountsRes,
  AdminPostDiscountsDiscountDynamicCodesReq,
  AdminPostDiscountsReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminDiscountsResource extends BaseResource {
  /**
   * @description Adds region to discount
   * @param id - discount id
   * @param regionId - region to add
   */
  addRegion(id: string, regionId: string): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/regions/${regionId}`
    return this.client.request("POST", path, {})
  }

  /**
   * @description Add valid product
   * @param id - discount id
   * @param productId - product to add
   */
  addValidProduct(
    id: string,
    productId: string
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/products/${productId}`
    return this.client.request("POST", path, {})
  }

  /**
   * @description Add valid product
   * @param payload - data of discount to create
   */
  create(payload: AdminPostDiscountsReq): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description Creates a dynamic discount code
   * @param id - id of parent discount
   * @param payload - data of dynamic discount code to create
   */
  createDynamicCode(
    id: string,
    payload: AdminPostDiscountsDiscountDynamicCodesReq
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}/dynamic-codes`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description Creates a dynamic discount code
   * @param id - id of parent discount
   * @param payload - data of dynamic discount code to create
   */
  delete(id: string): ResponsePromise<AdminDiscountsDeleteRes> {
    const path = `/admin/discounts/${id}`
    return this.client.request("DELETE", path)
  }

  /**
   * @description Creates a dynamic discount code
   * @param id - id of parent discount
   * @param code - code of dynamic discount to delete
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
   * @param id - id of parent discount
   * @param payload - data of dynamic discount code to create
   */
  retrieve(id: string): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${id}`
    return this.client.request("GET", path, payload)
  }
}

export default AdminDiscountsResource
