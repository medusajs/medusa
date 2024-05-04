import { SetRelation, Merge } from "../core/ModelUtils";
import type { PaymentCollection } from "./PaymentCollection";
import type { Region } from "./Region";
/**
 * The payment collection's details.
 */
export interface AdminPaymentCollectionsRes {
    /**
     * Payment Collection details.
     */
    payment_collection: Merge<SetRelation<PaymentCollection, "payment_sessions" | "payments" | "region">, {
        region: SetRelation<Region, "fulfillment_providers" | "payment_providers">;
    }>;
}
