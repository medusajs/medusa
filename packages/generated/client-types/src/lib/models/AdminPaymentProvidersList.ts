/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PaymentProvider } from "./PaymentProvider"

export interface AdminPaymentProvidersList {
  /**
   * An array of payment providers details.
   */
  payment_providers: Array<PaymentProvider>
}
