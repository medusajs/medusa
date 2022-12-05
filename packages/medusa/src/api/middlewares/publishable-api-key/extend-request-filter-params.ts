import { NextFunction, Request, Response } from "express"

import PublishableApiKeyService from "../../../services/publishable-api-key"

export type PublishableApiKeyScopes = {
  sales_channel_id: string[]
}

/**
 * The middleware, in case that a key is present in the request header,
 * attaches ids of resources within the scope of the key to the req object.
 *
 * @param req - request object
 * @param res - response object
 * @param next - next middleware call
 *
 * @throws if sales channel id is passed as a url or body param
 *         but that id is not in the scope defined by the PK from the header
 */
async function extendRequestFilterParams(
  req: Request & { publishableApiKeyScopes: PublishableApiKeyScopes },
  res: Response,
  next: NextFunction
) {
  const pubKey = req.get("x-publishable-api-key")

  const publishableKeyService: PublishableApiKeyService = req.scope.resolve(
    "publishableApiKeyService"
  )

  if (pubKey) {
    const channelId = req.body.sales_channel_id || req.params.sales_channel_id
    const scopes = await publishableKeyService.getResourceScopes(pubKey)
    req.publishableApiKeyScopes = scopes

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

export { extendRequestFilterParams }
