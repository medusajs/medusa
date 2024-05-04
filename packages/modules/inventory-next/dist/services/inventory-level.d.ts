import { Context } from "@medusajs/types";
import { InventoryLevel } from "../models/inventory-level";
import { InventoryLevelRepository } from "../repositories";
type InjectedDependencies = {
    inventoryLevelRepository: InventoryLevelRepository;
};
declare const InventoryLevelService_base: new <TEntity_1 extends object = any>(container: InjectedDependencies) => import("@medusajs/types").InternalModuleService<TEntity_1, InjectedDependencies>;
export default class InventoryLevelService<TEntity extends InventoryLevel = InventoryLevel> extends InventoryLevelService_base<TEntity> {
    protected readonly inventoryLevelRepository: InventoryLevelRepository;
    constructor(container: InjectedDependencies);
    retrieveStockedQuantity(inventoryItemId: string, locationIds: string[] | string, context?: Context): Promise<number>;
    getAvailableQuantity(inventoryItemId: string, locationIds: string[] | string, context?: Context): Promise<number>;
    getReservedQuantity(inventoryItemId: string, locationIds: string[] | string, context?: Context): Promise<number>;
}
export {};
