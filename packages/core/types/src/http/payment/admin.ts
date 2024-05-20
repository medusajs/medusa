import { BasePaymentProvider } from "./common"

export interface AdminPaymentProvider extends BasePaymentProvider {
  is_enabled: boolean
}
