import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { AdminCreateBrandType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const brandModule = req.scope.resolve(Modules.BRAND)
  const [brands, count] = await brandModule.listAndCountBrands(
    req.filterableFields,
    req.queryConfig
  )

  res.json({
    brands,
    count,
    offset: req.queryConfig.pagination?.skip || 0,
    limit: req.queryConfig.pagination?.take || 20,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateBrandType>,
  res: MedusaResponse
) => {
  const brandModule = req.scope.resolve(Modules.BRAND)
  const brand = await brandModule.createBrands(req.validatedBody)

  res.status(200).json({ brand })
}
