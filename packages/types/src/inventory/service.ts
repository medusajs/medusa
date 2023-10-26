import {
  CreateInventoryItemInput,
  CreateInventoryLevelInput,
  CreateReservationItemInput,
  FilterableInventoryItemProps,
  FilterableInventoryLevelProps,
  FilterableReservationItemProps,
  InventoryItemDTO,
  InventoryLevelDTO,
  ReservationItemDTO,
  UpdateInventoryLevelInput,
  UpdateReservationItemInput,
} from "./common"

import { FindConfig } from "../common"
import { ModuleJoinerConfig } from "../modules-sdk"
import { Context } from "../shared-context"

export interface IInventoryService {
  __joinerConfig(): ModuleJoinerConfig
  listInventoryItems(
    selector: FilterableInventoryItemProps,
    config?: FindConfig<InventoryItemDTO>,
    context?: Context
  ): Promise<[InventoryItemDTO[], number]>

  listReservationItems(
    selector: FilterableReservationItemProps,
    config?: FindConfig<ReservationItemDTO>,
    context?: Context
  ): Promise<[ReservationItemDTO[], number]>

  listInventoryLevels(
    selector: FilterableInventoryLevelProps,
    config?: FindConfig<InventoryLevelDTO>,
    context?: Context
  ): Promise<[InventoryLevelDTO[], number]>

  retrieveInventoryItem(
    inventoryItemId: string,
    config?: FindConfig<InventoryItemDTO>,
    context?: Context
  ): Promise<InventoryItemDTO>

  retrieveInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    context?: Context
  ): Promise<InventoryLevelDTO>

  retrieveReservationItem(
    reservationId: string,
    context?: Context
  ): Promise<ReservationItemDTO>

  createReservationItem(
    input: CreateReservationItemInput,
    context?: Context
  ): Promise<ReservationItemDTO>

  // TODO make it bulk
  createReservationItems(
    input: CreateReservationItemInput[],
    context?: Context
  ): Promise<ReservationItemDTO[]>

  createInventoryItem(
    input: CreateInventoryItemInput,
    context?: Context
  ): Promise<InventoryItemDTO>

  createInventoryItems(
    input: CreateInventoryItemInput[],
    context?: Context
  ): Promise<InventoryItemDTO[]>

  createInventoryLevel(
    data: CreateInventoryLevelInput,
    context?: Context
  ): Promise<InventoryLevelDTO>

  createInventoryLevels(
    data: CreateInventoryLevelInput[],
    context?: Context
  ): Promise<InventoryLevelDTO[]>

  updateInventoryLevels(
    updates: ({
      inventory_item_id: string
      location_id: string
    } & UpdateInventoryLevelInput)[],
    context?: Context
  ): Promise<InventoryLevelDTO[]>

  updateInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    update: UpdateInventoryLevelInput,
    context?: Context
  ): Promise<InventoryLevelDTO>

  updateInventoryItem(
    inventoryItemId: string,
    input: CreateInventoryItemInput,
    context?: Context
  ): Promise<InventoryItemDTO>

  updateReservationItem(
    reservationItemId: string,
    input: UpdateReservationItemInput,
    context?: Context
  ): Promise<ReservationItemDTO>

  deleteReservationItemsByLineItem(
    lineItemId: string | string[],
    context?: Context
  ): Promise<void>

  deleteReservationItem(
    reservationItemId: string | string[],
    context?: Context
  ): Promise<void>

  // TODO make it bulk
  deleteInventoryItem(
    inventoryItemId: string | string[],
    context?: Context
  ): Promise<void>

  restoreInventoryItem(
    inventoryItemId: string | string[],
    context?: Context
  ): Promise<void>

  deleteInventoryItemLevelByLocationId(
    locationId: string | string[],
    context?: Context
  ): Promise<void>

  deleteReservationItemByLocationId(
    locationId: string | string[],
    context?: Context
  ): Promise<void>

  deleteInventoryLevel(
    inventoryLevelId: string,
    locationId: string,
    context?: Context
  ): Promise<void>

  adjustInventory(
    inventoryItemId: string,
    locationId: string,
    adjustment: number,
    context?: Context
  ): Promise<InventoryLevelDTO>

  confirmInventory(
    inventoryItemId: string,
    locationIds: string[],
    quantity: number,
    context?: Context
  ): Promise<boolean>

  retrieveAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context?: Context
  ): Promise<number>

  retrieveStockedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context?: Context
  ): Promise<number>

  retrieveReservedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context?: Context
  ): Promise<number>
}
