/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Payment } from "./Payment"

/**
 * The payment's details.
 */
export interface AdminPaymentRes {
  /**
   * Payment details
   */
  payment: Payment
}
