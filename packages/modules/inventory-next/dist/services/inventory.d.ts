import { InternalModuleDeclaration } from "@medusajs/modules-sdk";
import { Context, DAL, IInventoryServiceNext, InventoryNext, InventoryTypes, ModuleJoinerConfig, ModulesSdkTypes, ReservationItemDTO } from "@medusajs/types";
import { ModulesSdkUtils } from "@medusajs/utils";
import { InventoryItem, InventoryLevel, ReservationItem } from "../models";
import InventoryLevelService from "./inventory-level";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    inventoryItemService: ModulesSdkTypes.InternalModuleService<any>;
    inventoryLevelService: InventoryLevelService<any>;
    reservationItemService: ModulesSdkTypes.InternalModuleService<any>;
};
declare const InventoryModuleService_base: new (container: InjectedDependencies) => ModulesSdkUtils.AbstractModuleService<InjectedDependencies, InventoryNext.InventoryItemDTO, {
    InventoryItem: {
        dto: InventoryNext.InventoryItemDTO;
    };
    InventoryLevel: {
        dto: InventoryNext.InventoryLevelDTO;
    };
    ReservationItem: {
        dto: InventoryNext.ReservationItemDTO;
    };
}>;
export default class InventoryModuleService<TInventoryItem extends InventoryItem = InventoryItem, TInventoryLevel extends InventoryLevel = InventoryLevel, TReservationItem extends ReservationItem = ReservationItem> extends InventoryModuleService_base implements IInventoryServiceNext {
    protected readonly moduleDeclaration?: InternalModuleDeclaration | undefined;
    protected baseRepository_: DAL.RepositoryService;
    protected readonly inventoryItemService_: ModulesSdkTypes.InternalModuleService<TInventoryItem>;
    protected readonly reservationItemService_: ModulesSdkTypes.InternalModuleService<TReservationItem>;
    protected readonly inventoryLevelService_: InventoryLevelService<TInventoryLevel>;
    constructor({ baseRepository, inventoryItemService, inventoryLevelService, reservationItemService, }: InjectedDependencies, moduleDeclaration?: InternalModuleDeclaration | undefined);
    __joinerConfig(): ModuleJoinerConfig;
    private ensureInventoryLevels;
    createReservationItems(input: InventoryNext.CreateReservationItemInput[], context?: Context): Promise<InventoryNext.ReservationItemDTO[]>;
    createReservationItems(input: InventoryNext.CreateReservationItemInput, context?: Context): Promise<InventoryNext.ReservationItemDTO>;
    createReservationItems_(input: InventoryNext.CreateReservationItemInput[], context?: Context): Promise<TReservationItem[]>;
    /**
     * Creates an inventory item
     * @param input - the input object
     * @param context
     * @return The created inventory item
     */
    create(input: InventoryNext.CreateInventoryItemInput, context?: Context): Promise<InventoryNext.InventoryItemDTO>;
    create(input: InventoryNext.CreateInventoryItemInput[], context?: Context): Promise<InventoryNext.InventoryItemDTO[]>;
    createInventoryItems_(input: InventoryNext.CreateInventoryItemInput[], context?: Context): Promise<InventoryNext.InventoryItemDTO[]>;
    createInventoryLevels(input: InventoryNext.CreateInventoryLevelInput, context?: Context): Promise<InventoryNext.InventoryLevelDTO>;
    createInventoryLevels(input: InventoryNext.CreateInventoryLevelInput[], context?: Context): Promise<InventoryNext.InventoryLevelDTO[]>;
    createInventoryLevels_(input: InventoryNext.CreateInventoryLevelInput[], context?: Context): Promise<TInventoryLevel[]>;
    /**
     * Updates inventory items
     * @param inventoryItemId - the id of the inventory item to update
     * @param input - the input object
     * @param context
     * @return The updated inventory item
     */
    update(input: InventoryNext.UpdateInventoryItemInput[], context?: Context): Promise<InventoryNext.InventoryItemDTO[]>;
    update(input: InventoryNext.UpdateInventoryItemInput, context?: Context): Promise<InventoryNext.InventoryItemDTO>;
    updateInventoryItems_(input: (Partial<InventoryNext.CreateInventoryItemInput> & {
        id: string;
    })[], context?: Context): Promise<TInventoryItem[]>;
    deleteInventoryItemLevelByLocationId(locationId: string | string[], context?: Context): Promise<[object[], Record<string, unknown[]>]>;
    /**
     * Deletes an inventory level
     * @param inventoryItemId - the id of the inventory item associated with the level
     * @param locationId - the id of the location associated with the level
     * @param context
     */
    deleteInventoryLevel(inventoryItemId: string, locationId: string, context?: Context): Promise<void>;
    updateInventoryLevels(updates: InventoryTypes.BulkUpdateInventoryLevelInput[], context?: Context): Promise<InventoryNext.InventoryLevelDTO[]>;
    updateInventoryLevels(updates: InventoryTypes.BulkUpdateInventoryLevelInput, context?: Context): Promise<InventoryNext.InventoryLevelDTO>;
    updateInventoryLevels_(updates: InventoryTypes.BulkUpdateInventoryLevelInput[], context?: Context): Promise<TInventoryLevel[]>;
    /**
     * Updates a reservation item
     * @param reservationItemId
     * @param input - the input object
     * @param context
     * @param context
     * @return The updated inventory level
     */
    updateReservationItems(input: InventoryNext.UpdateReservationItemInput[], context?: Context): Promise<InventoryNext.ReservationItemDTO[]>;
    updateReservationItems(input: InventoryNext.UpdateReservationItemInput, context?: Context): Promise<InventoryNext.ReservationItemDTO>;
    updateReservationItems_(input: (InventoryNext.UpdateReservationItemInput & {
        id: string;
    })[], context?: Context): Promise<TReservationItem[]>;
    deleteReservationItemByLocationId(locationId: string | string[], context?: Context): Promise<void>;
    /**
     * Deletes reservation items by line item
     * @param lineItemId - the id of the line item associated with the reservation item
     * @param context
     */
    deleteReservationItemsByLineItem(lineItemId: string | string[], context?: Context): Promise<void>;
    /**
     * Adjusts the inventory level for a given inventory item and location.
     * @param inventoryItemId - the id of the inventory item
     * @param locationId - the id of the location
     * @param adjustment - the number to adjust the inventory by (can be positive or negative)
     * @param context
     * @return The updated inventory level
     * @throws when the inventory level is not found
     */
    adjustInventory(inventoryItemId: string, locationId: string, adjustment: number, context?: Context): Promise<InventoryNext.InventoryLevelDTO>;
    adjustInventory_(inventoryItemId: string, locationId: string, adjustment: number, context?: Context): Promise<TInventoryLevel>;
    retrieveInventoryLevelByItemAndLocation(inventoryItemId: string, locationId: string, context?: Context): Promise<InventoryNext.InventoryLevelDTO>;
    /**
     * Retrieves the available quantity of a given inventory item in a given location.
     * @param inventoryItemId - the id of the inventory item
     * @param locationIds - the ids of the locations to check
     * @param context
     * @return The available quantity
     * @throws when the inventory item is not found
     */
    retrieveAvailableQuantity(inventoryItemId: string, locationIds: string[], context?: Context): Promise<number>;
    /**
     * Retrieves the stocked quantity of a given inventory item in a given location.
     * @param inventoryItemId - the id of the inventory item
     * @param locationIds - the ids of the locations to check
     * @param context
     * @return The stocked quantity
     * @throws when the inventory item is not found
     */
    retrieveStockedQuantity(inventoryItemId: string, locationIds: string[], context?: Context): Promise<number>;
    /**
     * Retrieves the reserved quantity of a given inventory item in a given location.
     * @param inventoryItemId - the id of the inventory item
     * @param locationIds - the ids of the locations to check
     * @param context
     * @return The reserved quantity
     * @throws when the inventory item is not found
     */
    retrieveReservedQuantity(inventoryItemId: string, locationIds: string[], context?: Context): Promise<number>;
    /**
     * Confirms whether there is sufficient inventory for a given quantity of a given inventory item in a given location.
     * @param inventoryItemId - the id of the inventory item
     * @param locationIds - the ids of the locations to check
     * @param quantity - the quantity to check
     * @param context
     * @return Whether there is sufficient inventory
     */
    confirmInventory(inventoryItemId: string, locationIds: string[], quantity: number, context?: Context): Promise<boolean>;
    private adjustInventoryLevelsForReservationsDeletion;
}
export {};
