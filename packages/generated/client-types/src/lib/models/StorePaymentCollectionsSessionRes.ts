/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PaymentSession } from "./PaymentSession"

/**
 * The details of the payment session.
 */
export interface StorePaymentCollectionsSessionRes {
  /**
   * Payment session's details.
   */
  payment_session: PaymentSession
}
