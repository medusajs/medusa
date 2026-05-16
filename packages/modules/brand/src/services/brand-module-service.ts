import { MedusaService } from "@medusajs/framework/utils"
import Brand from "../models/brand"
import { CreateBrandDTO, UpdateBrandDTO } from "../types"

export class BrandModuleService extends MedusaService<{
  Brand: { dto: CreateBrandDTO; updateDto: UpdateBrandDTO }
}>({ Brand }) {
  // MedusaService provides CRUD: create, update, delete, list, retrieve
}
