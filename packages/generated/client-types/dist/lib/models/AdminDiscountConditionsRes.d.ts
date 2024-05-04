import { SetRelation } from "../core/ModelUtils";
import type { DiscountCondition } from "./DiscountCondition";
export interface AdminDiscountConditionsRes {
    /**
     * Discount condition details.
     */
    discount_condition: SetRelation<DiscountCondition, "discount_rule">;
}
