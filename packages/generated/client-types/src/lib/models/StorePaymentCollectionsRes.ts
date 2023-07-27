/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PaymentCollection } from "./PaymentCollection"
import type { Region } from "./Region"

export interface StorePaymentCollectionsRes {
  /**
   * Payment collection's details.
   */
  payment_collection: Merge<
    SetRelation<PaymentCollection, "payment_sessions" | "region">,
    {
      region: SetRelation<Region, "fulfillment_providers" | "payment_providers">
    }
  >
}
