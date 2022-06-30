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
  create(payload: AdminPostGiftCardsReq, customHeaders: Record<string, any> = {}): ResponsePromise<AdminGiftCardsRes> {
    const path = `/admin/gift-cards`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description Updates a gift card
   */
  update(
    id: string,
    payload: AdminPostGiftCardsGiftCardReq,
    customHeaders: Record<string, any> = {}): ResponsePromise<AdminGiftCardsRes> {
    const path = `/admin/gift-cards/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description Deletes a gift card
   */
  delete(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<AdminGiftCardsDeleteRes> {
    const path = `/admin/gift-cards/${id}`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }

  /**
   * @description Deletes a gift card
   */
  retrieve(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<AdminGiftCardsRes> {
    const path = `/admin/gift-cards/${id}`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  /**
   * @description Lists gift cards
   */
  list(
    query?: AdminGetGiftCardsParams,
    customHeaders: Record<string, any> = {}): ResponsePromise<AdminGiftCardsListRes> {
    let path = `/admin/gift-cards/`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/gift-cards?${queryString}`
    }

    return this.client.request("GET", path, {}, {}, customHeaders)
  }
}

export default AdminGiftCardsResource
