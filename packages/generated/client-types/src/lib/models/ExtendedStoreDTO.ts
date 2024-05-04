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
  /**
   * The store's payment providers.
   */
  payment_providers: PaymentProvider
  /**
   * The store's fulfillment providers.
   */
  fulfillment_providers: FulfillmentProvider
  /**
   * The feature flags enabled in the store's backend.
   */
  feature_flags: FeatureFlagsResponse
  /**
   * The modules installed in the store's backend.
   */
  modules: ModulesResponse
}
