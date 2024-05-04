/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { GiftCard } from "./GiftCard"
import type { Region } from "./Region"

/**
 * The gift card's details.
 */
export interface AdminGiftCardsRes {
  /**
   * A gift card's details.
   */
  gift_card: Merge<
    SetRelation<GiftCard, "order" | "region">,
    {
      region: SetRelation<Region, "fulfillment_providers" | "payment_providers">
    }
  >
}
