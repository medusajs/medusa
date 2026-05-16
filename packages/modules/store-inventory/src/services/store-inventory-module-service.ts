import { MedusaService } from "@medusajs/framework/utils"
import StoreInventory from "../models/store-inventory"
import { CreateStoreInventoryDTO, UpdateStoreInventoryDTO } from "../types"

export class StoreInventoryModuleService extends MedusaService<{
  StoreInventory: { dto: CreateStoreInventoryDTO; updateDto: UpdateStoreInventoryDTO }
}>({ StoreInventory }) {}
