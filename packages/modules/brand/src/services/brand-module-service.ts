import {
  MedusaService,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/framework/utils"
import { Context, DAL } from "@medusajs/framework/types"
import Brand from "../models/brand"
import { CreateBrandDTO, UpdateBrandDTO } from "../types"

export class BrandModuleService extends MedusaService<{
  Brand: { dto: CreateBrandDTO; updateDto: UpdateBrandDTO }
}>({ Brand }) {
  // MedusaService provides CRUD: create, update, delete, list, retrieve
}
