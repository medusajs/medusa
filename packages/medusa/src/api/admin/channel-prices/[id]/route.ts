import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { AdminUpdateChannelPriceType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const channelPriceModule = req.scope.resolve(Modules.CHANNEL_PRICE)
  const channel_price = await channelPriceModule.retrieveChannelPrice(
    req.params.id,
    req.queryConfig
  )

  if (!channel_price) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `ChannelPrice with id: ${req.params.id} was not found`
    )
  }

  res.json({ channel_price })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateChannelPriceType>,
  res: MedusaResponse
) => {
  const channelPriceModule = req.scope.resolve(Modules.CHANNEL_PRICE)
  const channel_price = await channelPriceModule.updateChannelPrices(
    req.params.id,
    req.validatedBody
  )

  res.json({ channel_price })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const channelPriceModule = req.scope.resolve(Modules.CHANNEL_PRICE)
  await channelPriceModule.deleteChannelPrices(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "channel_price",
    deleted: true,
  })
}
