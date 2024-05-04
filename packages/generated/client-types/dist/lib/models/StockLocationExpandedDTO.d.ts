import type { SalesChannel } from "./SalesChannel";
import type { StockLocationDTO } from "./StockLocationDTO";
export type StockLocationExpandedDTO = StockLocationDTO & {
    /**
     * The associated sales channels.
     */
    sales_channels?: SalesChannel;
};
