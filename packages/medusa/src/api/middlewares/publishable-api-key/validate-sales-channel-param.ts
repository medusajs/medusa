import { NextFunction, Request, Response } from "express"

import { PublishableApiKeyScopes } from "./extend-request-filter-params"

/**
 * The middleware wil return 400 if sales channel id is passed as a url or body param
 * but that id is not in the scope defined by the PK from the header.
 *
 * @param req - request object
 * @param res - response object
 * @param next - next middleware call
 */
async function validateSalesChannelParam(
  req: Request & { publishableApiKeyScopes: PublishableApiKeyScopes },
  res: Response,
  next: NextFunction
) {
  const pubKey = req.get("x-publishable-api-key")

  if (pubKey) {
    const channelId = req.body.sales_channel_id || req.params.sales_channel_id
    const scopes = req.publishableApiKeyScopes

    if (
      channelId &&
      scopes.sales_channel_id.length &&
      !scopes.sales_channel_id.includes(channelId)
    ) {
      req.errors = req.errors ?? []
      req.errors.push(
        `Provided sales channel id param: ${channelId} is not associated with the Publishable API Key passed in the header of the request.`
      )
    }
  }

  next()
}

export { validateSalesChannelParam }
