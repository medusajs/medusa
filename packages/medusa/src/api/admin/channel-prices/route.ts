import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { AdminCreateChannelPriceType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const channelPriceModule = req.scope.resolve(Modules.CHANNEL_PRICE)
  const [channel_prices, count] = await channelPriceModule.listAndCountChannelPrices(
    req.filterableFields,
    req.queryConfig
  )

  res.json({
    channel_prices,
    count,
    offset: req.queryConfig.pagination?.skip || 0,
    limit: req.queryConfig.pagination?.take || 50,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateChannelPriceType>,
  res: MedusaResponse
) => {
  const channelPriceModule = req.scope.resolve(Modules.CHANNEL_PRICE)
  const channel_price = await channelPriceModule.createChannelPrices(req.validatedBody)

  res.status(200).json({ channel_price })
}
