import StripeBase from "../stripe-base"
import { PaymentIntentOptions } from "../../types"

export class StripeTest extends StripeBase {
  constructor(_, options) {
    super(_, options)
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {}
  }
}
