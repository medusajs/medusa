/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { GiftCard } from "./GiftCard"

/**
 * The gift card's details.
 */
export interface StoreGiftCardsRes {
  /**
   * Gift card details.
   */
  gift_card: GiftCard
}
