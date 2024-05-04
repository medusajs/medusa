import { SetRelation } from "../core/ModelUtils";
import type { PricedVariant } from "./PricedVariant";
/**
 * The product variant's details.
 */
export interface AdminVariantsRes {
    /**
     * Product variant's details.
     */
    variant: SetRelation<PricedVariant, "options" | "prices" | "product">;
}
