import { StoreGiftCardsRes } from "@medusajs/medusa"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

/**
 * This class is used to send requests to [Store Gift Card API Routes](https://docs.medusajs.com/api/store#gift-cards). All its method
 * are available in the JS Client under the `medusa.giftCards` property.
 * 
 * Customers can use gift cards during checkout to deduct the gift card's balance from the checkout total.
 * The methods in this class allow retrieving a gift card's details by its code. A gift card can be applied to a cart using {@link CartsResource}.
 * 
 * Related Guide: [How to use gift cards in a storefront](https://docs.medusajs.com/modules/gift-cards/storefront/use-gift-cards).
 */
class GiftCardsResource extends BaseResource {
  /**
   * Retrieve a Gift Card's details by its associated unique code.
   * @param {string} code - The code of the gift card.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreGiftCardsRes>} Resolves to the details of the gift card.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.giftCards.retrieve(code)
   * .then(({ gift_card }) => {
   *   console.log(gift_card.id);
   * })
   */
  retrieve(code: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreGiftCardsRes> {
    const path = `/store/gift-cards/${code}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default GiftCardsResource
