import { SetRelation } from "../core/ModelUtils";
import type { Customer } from "./Customer";
/**
 * The customer's details.
 */
export interface StoreCustomersRes {
    /**
     * Customer details.
     */
    customer: SetRelation<Customer, "billing_address" | "shipping_addresses">;
}
