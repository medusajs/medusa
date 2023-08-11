import { NextFunction, Request, Response } from "express"

import PublishableApiKeyService from "../../../services/publishable-api-key"

export type PublishableApiKeyScopes = {
  sales_channel_ids: string[]
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
async function extendRequestParams(
  req: Request & { publishableApiKeyScopes: PublishableApiKeyScopes },
  res: Response,
  next: NextFunction
) {
  const pubKey = req.get("x-publishable-api-key")

  if (pubKey) {
    const publishableKeyService: PublishableApiKeyService = req.scope.resolve(
      "publishableApiKeyService"
    )

    req.publishableApiKeyScopes = await publishableKeyService.getResourceScopes(
      pubKey
    )
  }

  next()
}

export { extendRequestParams }
