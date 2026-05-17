import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { AdminCreateBasicMaterialType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const materialModule = req.scope.resolve(Modules.MATERIAL)
  const [basic_materials, count] = await materialModule.listAndCountBasicMaterials(
    req.filterableFields,
    req.queryConfig
  )

  res.json({
    basic_materials,
    count,
    offset: req.queryConfig.pagination?.skip || 0,
    limit: req.queryConfig.pagination?.take || 50,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateBasicMaterialType>,
  res: MedusaResponse
) => {
  const materialModule = req.scope.resolve(Modules.MATERIAL)
  const basic_material = await materialModule.createBasicMaterials(req.validatedBody)

  res.status(200).json({ basic_material })
}
