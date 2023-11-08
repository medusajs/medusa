import {
  AdminPostShippingOptionsReq,
  AdminShippingOptionsRes,
  AdminPostShippingOptionsOptionReq,
  AdminShippingOptionsDeleteRes,
  AdminShippingOptionsListRes,
  AdminGetShippingOptionsParams,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Shipping Option API Routes](https://docs.medusajs.com/api/admin#shipping-options). All its method
 * are available in the JS Client under the `medusa.admin.shippingOptions` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * A shipping option is used to define the available shipping methods during checkout or when creating a return.
 * Admins can create an unlimited number of shipping options, each associated with a shipping profile and fulfillment provider, among other resources.
 * 
 * Related Guide: [Shipping Option architecture](https://docs.medusajs.com/modules/carts-and-checkout/shipping#shipping-option).
 */
class AdminShippingOptionsResource extends BaseResource {
  /**
   * Create a shipping option.
   * @param {AdminPostShippingOptionsReq} payload - The shipping option to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminShippingOptionsRes>} Resolves to the shipping option's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.shippingOptions.create({
   *   name: "PostFake",
   *   region_id,
   *   provider_id,
   *   data: {
   *   },
   *   price_type: "flat_rate"
   * })
   * .then(({ shipping_option }) => {
   *   console.log(shipping_option.id)
   * })
   */
  create(
    payload: AdminPostShippingOptionsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminShippingOptionsRes> {
    const path = `/admin/shipping-options`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update a shipping option's details.
   * @param {string} id - The shipping option's ID. 
   * @param {AdminPostShippingOptionsOptionReq} payload - The attributes to update in the shipping option.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminShippingOptionsRes>} Resolves to the shipping option's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.shippingOptions.update(optionId, {
   *   name: "PostFake",
   *   requirements: [
   *     {
   *       id,
   *       type: "max_subtotal",
   *       amount: 1000
   *     }
   *   ]
   * })
   * .then(({ shipping_option }) => {
   *   console.log(shipping_option.id)
   * })
   */
  update(
    id: string,
    payload: AdminPostShippingOptionsOptionReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminShippingOptionsRes> {
    const path = `/admin/shipping-options/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a shipping option. Once deleted, it can't be used when creating orders or returns.
   * @param {string} id - The shipping option's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminShippingOptionsDeleteRes>} Resolves to the deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.shippingOptions.delete(optionId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id);
   * })
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminShippingOptionsDeleteRes> {
    const path = `/admin/shipping-options/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a shipping option's details.
   * @param {string} id - The shipping option's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminShippingOptionsRes>} Resolves to the shipping option's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.shippingOptions.retrieve(optionId)
   * .then(({ shipping_option }) => {
   *   console.log(shipping_option.id);
   * })
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminShippingOptionsRes> {
    const path = `/admin/shipping-options/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of shipping options. The shipping options can be filtered by fields such as `region_id` or `is_return` passed in the `query` parameter.
   * @param {AdminGetShippingOptionsParams} query - Filters to apply on the retrieved shipping options.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminShippingOptionsListRes>} Resolves to the list of shipping options.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.shippingOptions.list()
   * .then(({ shipping_options, count }) => {
   *   console.log(shipping_options.length);
   * })
   */
  list(
    query?: AdminGetShippingOptionsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminShippingOptionsListRes> {
    let path = `/admin/shipping-options`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/shipping-options?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminShippingOptionsResource
