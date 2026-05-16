import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { AdminUpdateBrandType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const brandModule = req.scope.resolve(Modules.BRAND)
  const brand = await brandModule.retrieveBrand(req.params.id, req.queryConfig)

  if (!brand) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Brand with id: ${req.params.id} was not found`
    )
  }

  res.json({ brand })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateBrandType>,
  res: MedusaResponse
) => {
  const brandModule = req.scope.resolve(Modules.BRAND)
  const brand = await brandModule.updateBrands(req.params.id, req.validatedBody)

  res.json({ brand })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const brandModule = req.scope.resolve(Modules.BRAND)
  await brandModule.deleteBrands(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "brand",
    deleted: true,
  })
}
