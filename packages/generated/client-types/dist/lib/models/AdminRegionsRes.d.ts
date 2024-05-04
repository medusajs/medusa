import { SetRelation } from "../core/ModelUtils";
import type { Region } from "./Region";
/**
 * The region's details.
 */
export interface AdminRegionsRes {
    /**
     * Region details.
     */
    region: SetRelation<Region, "countries" | "fulfillment_providers" | "payment_providers">;
}
