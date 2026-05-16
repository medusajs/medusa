import { MedusaService } from "@medusajs/framework/utils"
import Shop from "../models/shop"
import { CreateShopDTO, UpdateShopDTO } from "../types"

export class ShopModuleService extends MedusaService<{
  Shop: { dto: CreateShopDTO; updateDto: UpdateShopDTO }
}>({ Shop }) {}
