import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { AdminCreateSalesMaterialType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const materialModule = req.scope.resolve(Modules.MATERIAL)
  const [sales_materials, count] = await materialModule.listAndCountSalesMaterials(
    req.filterableFields,
    req.queryConfig
  )

  res.json({
    sales_materials,
    count,
    offset: req.queryConfig.pagination?.skip || 0,
    limit: req.queryConfig.pagination?.take || 50,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateSalesMaterialType>,
  res: MedusaResponse
) => {
  const materialModule = req.scope.resolve(Modules.MATERIAL)
  const sales_material = await materialModule.createSalesMaterials(req.validatedBody)

  res.status(200).json({ sales_material })
}
