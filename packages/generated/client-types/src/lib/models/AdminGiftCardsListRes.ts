/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { GiftCard } from "./GiftCard"
import type { Region } from "./Region"

/**
 * The list of gift cards with pagination fields.
 */
export interface AdminGiftCardsListRes {
  /**
   * The list of gift cards.
   */
  gift_cards: Array<
    Merge<
      SetRelation<GiftCard, "order" | "region">,
      {
        region: SetRelation<
          Region,
          "fulfillment_providers" | "payment_providers"
        >
      }
    >
  >
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of gift cards skipped when retrieving the gift cards.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
