import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { AdminCreateShopType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const shopModule = req.scope.resolve(Modules.SHOP)
  const [shops, count] = await shopModule.listAndCount(
    req.filterableFields,
    req.queryConfig
  )

  res.json({
    shops,
    count,
    offset: req.queryConfig.pagination?.offset || 0,
    limit: req.queryConfig.pagination?.limit || 20,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateShopType>,
  res: MedusaResponse
) => {
  const shopModule = req.scope.resolve(Modules.SHOP)
  const shop = await shopModule.createShops(req.validatedBody)

  res.status(200).json({ shop })
}
