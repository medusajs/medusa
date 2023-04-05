/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PaymentProvider } from "./PaymentProvider"

export interface AdminPaymentProvidersList {
  payment_providers: Array<PaymentProvider>
}
