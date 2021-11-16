import { StoreGiftCardsRes } from "@medusajs/medusa"
import { AxiosPromise } from "axios"
import BaseResource from "./base"

class GiftCardsResource extends BaseResource {
  /**
   * @description Retrieves a single GiftCard
   * @param {string} code code of the gift card
   * @return {AxiosPromise<StoreGiftCardsRes>}
   */
  retrieve(code: string): AxiosPromise<StoreGiftCardsRes> {
    const path = `/store/gift-cards/${code}`
    return this.client.request("GET", path)
  }
}

export default GiftCardsResource
