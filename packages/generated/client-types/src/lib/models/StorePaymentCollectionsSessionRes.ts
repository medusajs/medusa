/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PaymentSession } from "./PaymentSession"

export interface StorePaymentCollectionsSessionRes {
  /**
   * Payment session's details.
   */
  payment_session: PaymentSession
}
