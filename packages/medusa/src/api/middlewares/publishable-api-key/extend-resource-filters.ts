import { NextFunction, Request, Response } from "express"

import PublishableApiKeyService from "../../../services/publishable-api-key"
import { MedusaError } from "medusa-core-utils"

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
 */
async function extendResourceFilters(
  req: Request & { publishableApiKeyScopes: PublishableApiKeyScopes },
  res: Response,
  next: NextFunction
) {
  const pubKey = req.get("x-publishable-api-key")

  const publishableKeyService: PublishableApiKeyService = req.scope.resolve(
    "publishableApiKeyService"
  )

  if (pubKey) {
    const scopes = await publishableKeyService.getResourceScopes(pubKey)
    req.publishableApiKeyScopes = scopes

    if (
      req.body.sales_channel_id &&
      scopes.sales_channel_id.length &&
      !scopes.sales_channel_id.includes(req.body.sales_channel_id)
    ) {
      req.errors = req.errors ?? []
      req.errors.push(
        `Provided sales channel id param: ${req.body.sales_channel_id} is not associated with the Publishable API Key passed in the header of the request.`
      )
    }
  }

  next()
}

export { extendResourceFilters }
