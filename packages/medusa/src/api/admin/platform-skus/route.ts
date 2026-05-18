import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { AdminCreatePlatformSkuType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const platformMappingModule = req.scope.resolve(Modules.PLATFORM_MAPPING)
  const [platformSkus, count] =
    await platformMappingModule.listAndCountPlatformSkus(
      req.filterableFields,
      req.queryConfig
    )

  res.json({
    platform_skus: platformSkus,
    count,
    offset: req.queryConfig.pagination?.skip || 0,
    limit: req.queryConfig.pagination?.take || 20,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreatePlatformSkuType>,
  res: MedusaResponse
) => {
  const platformMappingModule = req.scope.resolve(Modules.PLATFORM_MAPPING)
  const platformSku = await platformMappingModule.createPlatformSkus(
    req.validatedBody
  )

  res.status(200).json({ platform_sku: platformSku })
}
