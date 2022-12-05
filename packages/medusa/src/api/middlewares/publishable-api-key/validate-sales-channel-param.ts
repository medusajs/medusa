import { NextFunction, Request, Response } from "express"

import { PublishableApiKeyScopes } from "./extend-request-params"

/**
 * The middleware will return 400 if sales channel id is passed as an url or body param
 * but that id is not in the scope of the PK from the header.
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
    let channelIds = req.body.sales_channel_id || req.params.sales_channel_id

    if (!channelIds) {
      return next()
    }

    channelIds = !Array.isArray(channelIds) ? [channelIds] : channelIds

    const scopes = req.publishableApiKeyScopes

    if (
      scopes.sales_channel_id.length &&
      !channelIds.every((sc) => scopes.sales_channel_id.includes(sc))
    ) {
      req.errors = req.errors ?? []
      req.errors.push(
        `Provided sales channel id param: ${channelIds} is not associated with the Publishable API Key passed in the header of the request.`
      )
    }
  }

  next()
}

export { validateSalesChannelParam }
