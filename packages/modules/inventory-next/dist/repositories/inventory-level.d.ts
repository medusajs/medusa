import { Context } from "@medusajs/types";
declare const InventoryLevelRepository_base: new ({ manager }: {
    manager: any;
}) => import("@medusajs/utils").MikroOrmBaseRepository<object>;
export declare class InventoryLevelRepository extends InventoryLevelRepository_base {
    getReservedQuantity(inventoryItemId: string, locationIds: string[], context?: Context): Promise<number>;
    getAvailableQuantity(inventoryItemId: string, locationIds: string[], context?: Context): Promise<number>;
    getStockedQuantity(inventoryItemId: string, locationIds: string[], context?: Context): Promise<number>;
}
export {};
