import { MikroOrmBase } from "@medusajs/utils";
import { CalculatedPriceSetDTO, Context, PricingContext, PricingFilters, PricingRepositoryService } from "@medusajs/types";
export declare class PricingRepository extends MikroOrmBase implements PricingRepositoryService {
    constructor();
    calculatePrices(pricingFilters: PricingFilters, pricingContext?: PricingContext, sharedContext?: Context): Promise<CalculatedPriceSetDTO[]>;
}
