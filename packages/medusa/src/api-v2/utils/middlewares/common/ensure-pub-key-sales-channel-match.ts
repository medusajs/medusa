import { NextFunction } from "express"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { StoreCreateCartType } from "../../../store/carts/validators"

/**
 * If a publishable key (PK) is passed in the header of the request AND
 * the request carries a sales channel id param in the url or body,
 * we check if the sales channel is valid for the key.
 *
 * If the request does not carry a sales channel id, we attempt to assign
 * a sales channel associated with the PK.
 *
 * @throws If sales channel id is passed as a url or body param
 *         but that id is not in the scope defined by the PK from the header.
 *         If the PK is associated with multiple sales channels but no
 *         sales channel id is passed in the request.
 */
export async function ensurePublishableKeyAndSalesChannelMatch(
  req: MedusaRequest<StoreCreateCartType> & { publishableApiKeyScopes },
  res: MedusaResponse,
  next: NextFunction
) {
  const pubKey = req.get("x-publishable-api-key")

  if (pubKey) {
    const scopes = req.publishableApiKeyScopes
    const channelId = req.validatedBody?.sales_channel_id

    req.errors = req.errors ?? []

    if (
      scopes.sales_channel_ids.length &&
      channelId &&
      !scopes.sales_channel_ids.includes(channelId)
    ) {
      req.errors.push(
        `Sales channel ID in payload ${channelId} is not associated with the Publishable API Key in the header.`
      )
    }

    if (scopes.sales_channel_ids.length && !channelId) {
      if (scopes.sales_channel_ids.length > 1) {
        req.errors.push(
          `Cannot assign sales channel to cart. The Publishable API Key in the header has multiple associated sales channels. Please provide a sales channel ID in the request body.`
        )
      } else {
        req.validatedBody.sales_channel_id = scopes.sales_channel_ids[0]
      }
    }
  }

  next()
}
