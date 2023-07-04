/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { GiftCard } from "./GiftCard"
import type { Region } from "./Region"

export interface AdminGiftCardsRes {
  gift_card: Merge<
    SetRelation<GiftCard, "order" | "region">,
    {
      region: SetRelation<Region, "fulfillment_providers" | "payment_providers">
    }
  >
}
