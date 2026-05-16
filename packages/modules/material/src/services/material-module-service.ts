import { MedusaService } from "@medusajs/framework/utils"
import BasicMaterial from "../models/basic-material"
import SalesMaterial from "../models/sales-material"
import ComboItem from "../models/combo-item"
import {
  CreateBasicMaterialDTO,
  UpdateBasicMaterialDTO,
  CreateSalesMaterialDTO,
  UpdateSalesMaterialDTO,
  CreateComboItemDTO,
  UpdateComboItemDTO,
} from "../types"

export class MaterialModuleService extends MedusaService<{
  BasicMaterial: { dto: CreateBasicMaterialDTO; updateDto: UpdateBasicMaterialDTO }
  SalesMaterial: { dto: CreateSalesMaterialDTO; updateDto: UpdateSalesMaterialDTO }
  ComboItem: { dto: CreateComboItemDTO; updateDto: UpdateComboItemDTO }
}>({ BasicMaterial, SalesMaterial, ComboItem }) {}
