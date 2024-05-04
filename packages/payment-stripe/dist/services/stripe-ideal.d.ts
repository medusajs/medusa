import StripeBase from "../core/stripe-base";
import { PaymentIntentOptions } from "../types";
declare class IdealProviderService extends StripeBase {
    static PROVIDER: string;
    constructor(_: any, options: any);
    get paymentIntentOptions(): PaymentIntentOptions;
}
export default IdealProviderService;
