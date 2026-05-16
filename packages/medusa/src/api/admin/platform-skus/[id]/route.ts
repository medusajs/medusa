import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { AdminUpdatePlatformSkuType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const platformMappingModule = req.scope.resolve(Modules.PLATFORM_MAPPING)
  const platformSku = await platformMappingModule.retrievePlatformSku(
    req.params.id,
    req.queryConfig
  )

  res.json({ platform_sku: platformSku })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdatePlatformSkuType>,
  res: MedusaResponse
) => {
  const platformMappingModule = req.scope.resolve(Modules.PLATFORM_MAPPING)
  const platformSku = await platformMappingModule.updatePlatformSkus(
    req.params.id,
    req.validatedBody
  )

  res.json({ platform_sku: platformSku })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const platformMappingModule = req.scope.resolve(Modules.PLATFORM_MAPPING)
  await platformMappingModule.deletePlatformSkus(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "platform_sku",
    deleted: true,
  })
}
