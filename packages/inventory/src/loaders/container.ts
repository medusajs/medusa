import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/modules-sdk"

import {
  InventoryItemService,
  InventoryLevelService,
  ReservationItemService,
} from "../services"

import { asClass } from "awilix"

export default async (
  { container }: LoaderOptions,
  moduleDeclaration?: InternalModuleDeclaration
): Promise<void> => {
  container.register({
    inventoryItemService: asClass(InventoryItemService).singleton(),
    inventoryLevelService: asClass(InventoryLevelService).singleton(),
    reservationItemService: asClass(ReservationItemService).singleton(),
  })
}
