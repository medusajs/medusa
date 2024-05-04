import { OrderTypes } from "@medusajs/types";
export declare function formatOrder(order: any, options: {
    includeTotals?: boolean;
}): OrderTypes.OrderDTO | OrderTypes.OrderDTO[];
export declare function mapRepositoryToOrderModel(config: any): any;
