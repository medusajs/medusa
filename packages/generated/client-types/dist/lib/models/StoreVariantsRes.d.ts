import { SetRelation } from "../core/ModelUtils";
import type { PricedVariant } from "./PricedVariant";
/**
 * The product variant's details.
 */
export interface StoreVariantsRes {
    /**
     * Product variant description.
     */
    variant: SetRelation<PricedVariant, "prices" | "options" | "product" | "purchasable">;
}
