import { ModulesSdkTypes } from "@medusajs/modules-sdk"

import {
  InventoryItemService,
  InventoryLevelService,
  ReservationItemService,
} from "../services"

import { asClass } from "awilix"

export default async (
  { container }: ModulesSdkTypes.LoaderOptions,
  moduleDeclaration?: ModulesSdkTypes.InternalModuleDeclaration
): Promise<void> => {
  container.register({
    inventoryItemService: asClass(InventoryItemService).singleton(),
    inventoryLevelService: asClass(InventoryLevelService).singleton(),
    reservationItemService: asClass(ReservationItemService).singleton(),
  })
}
