/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { FeatureFlagsResponse } from "./FeatureFlagsResponse"
import type { FulfillmentProvider } from "./FulfillmentProvider"
import type { ModulesResponse } from "./ModulesResponse"
import type { PaymentProvider } from "./PaymentProvider"
import type { Store } from "./Store"

export type ExtendedStoreDTO = Store & {
  payment_providers: PaymentProvider
  fulfillment_providers: FulfillmentProvider
  feature_flags: FeatureFlagsResponse
  modules: ModulesResponse
}
