import {
  AdminDeleteDiscountsDiscountConditionsConditionBatchReq,
  AdminDiscountConditionsRes,
  AdminDiscountsDeleteRes,
  AdminDiscountsListRes,
  AdminDiscountsRes,
  AdminGetDiscountParams,
  AdminGetDiscountsDiscountConditionsConditionParams,
  AdminGetDiscountsParams,
  AdminPostDiscountsDiscountConditions,
  AdminPostDiscountsDiscountConditionsCondition,
  AdminPostDiscountsDiscountConditionsConditionBatchParams,
  AdminPostDiscountsDiscountConditionsConditionBatchReq,
  AdminPostDiscountsDiscountConditionsConditionParams,
  AdminPostDiscountsDiscountConditionsParams,
  AdminPostDiscountsDiscountDynamicCodesReq,
  AdminPostDiscountsDiscountReq,
  AdminPostDiscountsReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Discount API Routes](https://docs.medusajs.com/api/admin#discounts). All its method
 * are available in the JS Client under the `medusa.admin.discounts` property.
 *
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 *
 * Admins can create discounts with conditions and rules, providing them with advanced settings for variety of cases.
 * The methods in this class can be used to manage discounts, their conditions, resources, and more.
 *
 * Related Guide: [How to manage discounts](https://docs.medusajs.com/modules/discounts/admin/manage-discounts).
 */
class AdminDiscountsResource extends BaseResource {
  /**
   * Add a Region to the list of Regions a Discount can be used in.
   * @param {string} id - The discount's ID.
   * @param {string} regionId - The ID of the region to add.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDiscountsRes>} Resolves to the discount's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.addRegion(discountId, regionId)
   * .then(({ discount }) => {
   *   console.log(discount.id);
   * })
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
   * Create a discount with a given set of rules that defines how the discount is applied.
   * @param {AdminPostDiscountsReq} payload - The discount to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDiscountsRes>} Resolves to the discount's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * import { AllocationType, DiscountRuleType } from "@medusajs/medusa"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.create({
   *   code: "TEST",
   *   rule: {
   *     type: DiscountRuleType.FIXED,
   *     value: 10,
   *     allocation: AllocationType.ITEM
   *   },
   *   regions: ["reg_XXXXXXXX"],
   *   is_dynamic: false,
   *   is_disabled: false
   * })
   * .then(({ discount }) => {
   *   console.log(discount.id);
   * })
   */
  create(
    payload: AdminPostDiscountsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update a discount with a given set of rules that define how the discount is applied.
   * @param {string} id - The discount's ID.
   * @param {AdminPostDiscountsDiscountReq} payload - The attributes to update in the discount.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDiscountsRes>} Resolves to the details of the discount.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.update(discountId, {
   *   code: "TEST"
   * })
   * .then(({ discount }) => {
   *   console.log(discount.id);
   * })
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
   * Create a dynamic unique code that can map to a parent discount. This is useful if you want to automatically generate codes with the same rules and conditions.
   * @param {string} id - The discount's ID.
   * @param {AdminPostDiscountsDiscountDynamicCodesReq} payload - The dynamic code to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDiscountsRes>} Resolves to the details of the discount.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.createDynamicCode(discountId, {
   *   code: "TEST",
   *   usage_limit: 1
   * })
   * .then(({ discount }) => {
   *   console.log(discount.id);
   * })
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
   * Delete a discount. Deleting the discount will make it unavailable for customers to use.
   * @param {string} id - The discount's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDiscountsDeleteRes>} Resolves to the delete operation details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.delete(discountId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id);
   * })
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsDeleteRes> {
    const path = `/admin/discounts/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Delete a dynamic code from a discount.
   * @param {string} id - The discount's ID.
   * @param {string} code - The code of the dynamic code to delete.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDiscountsRes>} Resolves to the details of the discount.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.deleteDynamicCode(discountId, code)
   * .then(({ discount }) => {
   *   console.log(discount.id);
   * })
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
   * Retrieve a discount.
   * @param {string} id - The discount's ID.
   * @param {AdminGetDiscountParams} query - Configurations to apply on the retrieved product category.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDiscountsRes>} Resolves to the details of the discount.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.retrieve(discountId)
   * .then(({ discount }) => {
   *   console.log(discount.id);
   * })
   */
  retrieve(
    id: string,
    query?: AdminGetDiscountParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsRes> {
    let path = `/admin/discounts/${id}`

    if (query) {
      const queryString = qs.stringify(query)
      path = `${path}?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a discount's details by its discount code.
   * @param {string} code - The code of the discount.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDiscountsRes>} Resolves to the details of the discount.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.retrieveByCode(code)
   * .then(({ discount }) => {
   *   console.log(discount.id);
   * })
   */
  retrieveByCode(
    code: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/code/${code}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of Discounts. The discounts can be filtered by fields such as `rule` or `is_dynamic`. The discounts can also be paginated.
   * @param {AdminGetDiscountsParams} query - Filters and pagination configurations to apply on the retrieved discounts.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDiscountsListRes>} Resolves to the list of discounts with pagination fields.
   *
   * @example
   * To list discounts:
   *
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.list()
   * .then(({ discounts, limit, offset, count }) => {
   *   console.log(discounts.id);
   * })
   * ```
   *
   * To specify relations that should be retrieved within the discounts:
   *
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.list({
   *   expand: "rule"
   * })
   * .then(({ discounts, limit, offset, count }) => {
   *   console.log(discounts.id);
   * })
   * ```
   *
   * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   *
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.list({
   *   expand: "rule",
   *   limit,
   *   offset
   * })
   * .then(({ discounts, limit, offset, count }) => {
   *   console.log(discounts.id);
   * })
   * ```
   */
  list(
    query?: AdminGetDiscountsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsListRes> {
    let path = `/admin/discounts`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Remove a Region from the list of Regions that a Discount can be used in. This does not delete a region, only the association between it and the discount.
   * @param {string} id - The discount's ID.
   * @param {string} regionId - The ID of the region to remove.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDiscountsRes>} Resolves to the details of the discount.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.removeRegion(discountId, regionId)
   * .then(({ discount }) => {
   *   console.log(discount.id);
   * })
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
   * Create a discount condition. Only one of `products`, `product_types`, `product_collections`, `product_tags`, and `customer_groups` should be provided in the `payload` parameter,
   * based on the type of discount condition. For example, if the discount condition's type is `products`, the `products` field should be provided in the `payload` parameter.
   * @param {string} discountId - The discount's ID.
   * @param {AdminPostDiscountsDiscountConditions} payload - The discount condition to create.
   * @param {AdminPostDiscountsDiscountConditionsParams} query - Configurations to apply on the returned discount.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDiscountsRes>} Resolves to the details of the discount.
   *
   * @example
   * To create a condition in a discount:
   *
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * import { DiscountConditionOperator } from "@medusajs/medusa"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.createCondition(discountId, {
   *   operator: DiscountConditionOperator.IN,
   *   products: [productId]
   * })
   * .then(({ discount }) => {
   *   console.log(discount.id);
   * })
   * ```
   *
   * To specify relations that should be retrieved as part of the response:
   *
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * import { DiscountConditionOperator } from "@medusajs/medusa"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.createCondition(discountId, {
   *   operator: DiscountConditionOperator.IN,
   *   products: [productId]
   * }, {
   *   expand: "rule"
   * })
   * .then(({ discount }) => {
   *   console.log(discount.id);
   * })
   * ```
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
      path += `?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update a discount condition. Only one of `products`, `product_types`, `product_collections`, `product_tags`, and `customer_groups` should be provided in the `payload` parameter,
   * based on the type of discount condition. For example, if the discount condition's type is `products`, the `products` field should be provided in the `payload` parameter.
   * @param {string} discountId - The discount's ID.
   * @param {string} conditionId - The ID of the discount condition.
   * @param {AdminPostDiscountsDiscountConditionsCondition} payload - The attributes to update in the discount condition.
   * @param {AdminPostDiscountsDiscountConditionsConditionParams} query - Configurations to apply on the returned discount.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDiscountsRes>} Resolves to the details of the discount.
   *
   * @example
   * To update a condition in a discount:
   *
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.updateCondition(discountId, conditionId, {
   *   products: [
   *     productId
   *   ]
   * })
   * .then(({ discount }) => {
   *   console.log(discount.id);
   * })
   * ```
   *
   * To specify relations that should be retrieved as part of the response:
   *
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.updateCondition(discountId, conditionId, {
   *   products: [
   *     productId
   *   ]
   * }, {
   *   expand: "rule"
   * })
   * .then(({ discount }) => {
   *   console.log(discount.id);
   * })
   * ```
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
      path += `?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a discount condition. This doesn't delete resources associated to the discount condition.
   * @param {string} discountId - The discount's ID.
   * @param {string} conditionId - The ID of the discount condition.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDiscountsDeleteRes>} Resolves to the deletion operation details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.deleteCondition(discountId, conditionId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id);
   * })
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
   * Retrieve a Discount Condition's details.
   * @param {string} discountId - The ID of the discount that the condition belongs to.
   * @param {string} conditionId - The ID of the discount condition.
   * @param {AdminGetDiscountsDiscountConditionsConditionParams} query - Configurations to apply on the retrieved discount condition.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDiscountConditionsRes>} Resolves to the discount condition details.
   *
   * @example
   * A simple example that retrieves a discount condition by its ID:
   *
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.getCondition(discountId, conditionId)
   * .then(({ discount_condition }) => {
   *   console.log(discount_condition.id);
   * })
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.getCondition(discountId, conditionId, {
   *   expand: "discount_rule"
   * })
   * .then(({ discount_condition }) => {
   *   console.log(discount_condition.id);
   * })
   * ```
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
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Add a batch of resources to a discount condition. The type of resource depends on the type of discount condition. For example, if the discount condition's type is `products`,
   * the resources being added should be products.
   * @param {string} discountId - The ID of the discount the condition belongs to.
   * @param {string} conditionId - The ID of the discount condition.
   * @param {AdminPostDiscountsDiscountConditionsConditionBatchReq} payload - The resources to add to the discount condition.
   * @param {AdminPostDiscountsDiscountConditionsConditionBatchParams} query - Configurations to apply on the retrieved discount.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDiscountsRes>} Resolves to the details of the discount.
   *
   * @example
   * To add resources to a discount condition:
   *
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.addConditionResourceBatch(discountId, conditionId, {
   *   resources: [{ id: itemId }]
   * })
   * .then(({ discount }) => {
   *   console.log(discount.id);
   * })
   * ```
   *
   * To specify relations to include in the returned discount:
   *
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.addConditionResourceBatch(discountId, conditionId, {
   *   resources: [{ id: itemId }]
   * }, {
   *   expand: "rule"
   * })
   * .then(({ discount }) => {
   *   console.log(discount.id);
   * })
   * ```
   */
  addConditionResourceBatch(
    discountId: string,
    conditionId: string,
    payload: AdminPostDiscountsDiscountConditionsConditionBatchReq,
    query?: AdminPostDiscountsDiscountConditionsConditionBatchParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsRes> {
    let path = `/admin/discounts/${discountId}/conditions/${conditionId}/batch`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Remove a batch of resources from a discount condition. This will only remove the association between the resource and the discount condition, not the resource itself.
   * @param {string} discountId - The ID of the discount the condition belongs to.
   * @param {string} conditionId - The ID of the discount condition.
   * @param {AdminDeleteDiscountsDiscountConditionsConditionBatchReq} payload - The resources to remove.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDiscountsRes>} Resolves to the details of the discount.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.discounts.deleteConditionResourceBatch(discountId, conditionId, {
   *   resources: [{ id: itemId }]
   * })
   * .then(({ discount }) => {
   *   console.log(discount.id);
   * })
   */
  deleteConditionResourceBatch(
    discountId: string,
    conditionId: string,
    payload: AdminDeleteDiscountsDiscountConditionsConditionBatchReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDiscountsRes> {
    const path = `/admin/discounts/${discountId}/conditions/${conditionId}/batch`
    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }
}

export default AdminDiscountsResource
