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

class AdminGiftCardsResource extends BaseResource {
  /**
   * @description Creates a gift card
   */
  create(payload: AdminPostGiftCardsReq): ResponsePromise<AdminGiftCardsRes> {
    const path = `/admin/gift-cards`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description Updates a gift card
   */
  update(
    id: string,
    payload: AdminPostGiftCardsGiftCardReq
  ): ResponsePromise<AdminGiftCardsRes> {
    const path = `/admin/gift-cards/${id}`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description Deletes a gift card
   */
  delete(id: string): ResponsePromise<AdminGiftCardsDeleteRes> {
    const path = `/admin/gift-cards/${id}`
    return this.client.request("DELETE", path)
  }

  /**
   * @description Deletes a gift card
   */
  retrieve(id: string): ResponsePromise<AdminGiftCardsRes> {
    const path = `/admin/gift-cards/${id}`
    return this.client.request("GET", path)
  }

  /**
   * @description Lists gift cards
   */
  list(
    query?: AdminGetGiftCardsParams
  ): ResponsePromise<AdminGiftCardsListRes> {
    let path = `/admin/gift-cards/`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/gift-cards?${queryString}`
    }

    return this.client.request("GET", path)
  }
}

export default AdminGiftCardsResource
