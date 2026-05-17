import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { AdminUpdateSalesMaterialType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const materialModule = req.scope.resolve(Modules.MATERIAL)
  const sales_material = await materialModule.retrieveSalesMaterial(
    req.params.id,
    req.queryConfig
  )

  if (!sales_material) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `SalesMaterial with id: ${req.params.id} was not found`
    )
  }

  res.json({ sales_material })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateSalesMaterialType>,
  res: MedusaResponse
) => {
  const materialModule = req.scope.resolve(Modules.MATERIAL)
  const sales_material = await materialModule.updateSalesMaterials(
    req.params.id,
    req.validatedBody
  )

  res.json({ sales_material })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const materialModule = req.scope.resolve(Modules.MATERIAL)
  await materialModule.deleteSalesMaterials(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "sales_material",
    deleted: true,
  })
}
