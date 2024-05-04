import StripeBase from "../core/stripe-base";
import { PaymentIntentOptions } from "../types";
declare class Przelewy24ProviderService extends StripeBase {
    static PROVIDER: string;
    constructor(_: any, options: any);
    get paymentIntentOptions(): PaymentIntentOptions;
}
export default Przelewy24ProviderService;
