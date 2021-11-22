import { StoreGiftCardsRes } from "@medusajs/medusa"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

class GiftCardsResource extends BaseResource {
  /**
   * @description Retrieves a single GiftCard
   * @param {string} code code of the gift card
   * @return {ResponsePromise<StoreGiftCardsRes>}
   */
  retrieve(code: string): ResponsePromise<StoreGiftCardsRes> {
    const path = `/store/gift-cards/${code}`
    return this.client.request("GET", path)
  }
}

export default GiftCardsResource
