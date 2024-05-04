import { NextFunction, Request, Response } from "express"

import PublishableApiKeyService from "../../../services/publishable-api-key"
import { ProductVariantService } from "../../../services"

/**
 * The middleware check if requested product is assigned to a SC associated with PK in the header.
 *
 * @param req - request object
 * @param res - response object
 * @param next - next middleware call
 */
async function validateProductVariantSalesChannelAssociation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const pubKey = req.get("x-publishable-api-key")

  if (pubKey) {
    const productVariantService: ProductVariantService = req.scope.resolve(
      "productVariantService"
    )
    const publishableKeyService: PublishableApiKeyService = req.scope.resolve(
      "publishableApiKeyService"
    )

    const { sales_channel_ids: salesChannelIds } =
      await publishableKeyService.getResourceScopes(pubKey)

    let isVariantInSalesChannel = false

    try {
      isVariantInSalesChannel =
        await productVariantService.isVariantInSalesChannels(
          req.params.id,
          salesChannelIds
        )
    } catch (error) {
      next(error)
    }

    if (salesChannelIds.length && !isVariantInSalesChannel) {
      req.errors = req.errors ?? []
      req.errors.push(
        `Variant with id: ${req.params.id} is not associated with sales channels defined by the Publishable API Key passed in the header of the request.`
      )
    }
  }

  next()
}

export { validateProductVariantSalesChannelAssociation }
