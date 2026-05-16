import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { AdminUpdateShopType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const shopModule = req.scope.resolve(Modules.SHOP)
  const shop = await shopModule.retrieveShop(req.params.id, req.queryConfig)

  if (!shop) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Shop with id: ${req.params.id} was not found`
    )
  }

  res.json({ shop })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateShopType>,
  res: MedusaResponse
) => {
  const shopModule = req.scope.resolve(Modules.SHOP)
  const shop = await shopModule.updateShops(req.params.id, req.validatedBody)

  res.json({ shop })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const shopModule = req.scope.resolve(Modules.SHOP)
  await shopModule.deleteShops(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "shop",
    deleted: true,
  })
}
