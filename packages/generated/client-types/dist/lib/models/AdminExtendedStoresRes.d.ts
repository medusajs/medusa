import { SetRelation } from "../core/ModelUtils";
import type { ExtendedStoreDTO } from "./ExtendedStoreDTO";
/**
 * The store's details with additional details like payment and tax providers.
 */
export interface AdminExtendedStoresRes {
    /**
     * Store details.
     */
    store: SetRelation<ExtendedStoreDTO, "currencies" | "default_currency">;
}
