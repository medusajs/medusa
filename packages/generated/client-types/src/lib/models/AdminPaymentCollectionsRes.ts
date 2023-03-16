/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PaymentCollection } from "./PaymentCollection"
import type { Region } from "./Region"

export interface AdminPaymentCollectionsRes {
  payment_collection: Merge<
    SetRelation<PaymentCollection, "payment_sessions" | "payments" | "region">,
    {
      region: SetRelation<Region, "fulfillment_providers" | "payment_providers">
    }
  >
}
