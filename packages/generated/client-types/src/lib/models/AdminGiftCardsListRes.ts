/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { GiftCard } from "./GiftCard"
import type { Region } from "./Region"

export interface AdminGiftCardsListRes {
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
   * The number of items skipped before these items
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
