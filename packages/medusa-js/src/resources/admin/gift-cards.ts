import {
  AdminGetGiftCardsParams,
  AdminGiftCardsDeleteRes,
  AdminGiftCardsListRes,
  AdminGiftCardsRes,
  AdminPostGiftCardsGiftCardReq,
  AdminPostGiftCardsReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Gift Card API Routes](https://docs.medusajs.com/api/admin#gift-cards). All its method
 * are available in the JS Client under the `medusa.admin.giftCards` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * Admins can create gift cards and send them directly to customers, specifying options like their balance, region, and more.
 * These gift cards are different than the saleable gift cards in a store, which are created and managed through {@link AdminProductsResource}.
 * 
 * Related Guide: [How to manage gift cards](https://docs.medusajs.com/modules/gift-cards/admin/manage-gift-cards#manage-custom-gift-cards).
 */
class AdminGiftCardsResource extends BaseResource {
  /**
   * Create a gift card that can redeemed by its unique code. The Gift Card is only valid within `1` region.
   * @param {AdminPostGiftCardsReq} payload - The gift card to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminGiftCardsRes>} Resolves to the gift card's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.giftCards.create({
   *   region_id
   * })
   * .then(({ gift_card }) => {
   *   console.log(gift_card.id);
   * })
   */
  create(
    payload: AdminPostGiftCardsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminGiftCardsRes> {
    const path = `/admin/gift-cards`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update a gift card's details.
   * @param {string} id - The ID of the gift card.
   * @param {AdminPostGiftCardsGiftCardReq} payload - The attributes to update in the gift card.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminGiftCardsRes>} Resolves to the gift card's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.giftCards.update(giftCardId, {
   *   region_id
   * })
   * .then(({ gift_card }) => {
   *   console.log(gift_card.id);
   * })
   */
  update(
    id: string,
    payload: AdminPostGiftCardsGiftCardReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminGiftCardsRes> {
    const path = `/admin/gift-cards/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a gift card. Once deleted, it can't be used by customers.
   * @param {string} id - The ID of the gift card.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminGiftCardsDeleteRes>} Resolves to the deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.giftCards.delete(giftCardId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id);
   * })
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminGiftCardsDeleteRes> {
    const path = `/admin/gift-cards/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a gift card's details.
   * @param {string} id - The ID of the gift card.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminGiftCardsRes>} Resolves to the gift card's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.giftCards.retrieve(giftCardId)
   * .then(({ gift_card }) => {
   *   console.log(gift_card.id);
   * })
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminGiftCardsRes> {
    const path = `/admin/gift-cards/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of gift cards. The gift cards can be filtered by fields such as `q` passed in the `query` parameter. The gift cards can also paginated.
   * @param {AdminGetGiftCardsParams} query - Filters and pagination configurations to apply on the retrieved gift cards.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminGiftCardsListRes>} Resolves to the list of gift cards with pagination fields.
   * 
   * @example
   * To list gift cards:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.giftCards.list()
   * .then(({ gift_cards, limit, offset, count }) => {
   *   console.log(gift_cards.length);
   * })
   * ```
   * 
   * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.giftCards.list({
   *   limit,
   *   offset
   * })
   * .then(({ gift_cards, limit, offset, count }) => {
   *   console.log(gift_cards.length);
   * })
   * ```
   */
  list(
    query?: AdminGetGiftCardsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminGiftCardsListRes> {
    let path = `/admin/gift-cards/`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/gift-cards?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminGiftCardsResource
