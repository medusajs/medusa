import { NextFunction, Request, Response } from "express"

import PublishableApiKeyService from "../../../services/publishable-api-key"

export type PublishableApiKeyScopes = {
  sales_channel_id: string[]
}

/**
 * The middleware checks if a publishable api key is passed in the request header.
 * In case that a key is present in the request header, attach ids of resources
 * within the scope of the key to the req object.
 *
 * @param req - request object
 * @param res - response object
 * @param next - next middleware call
 */
async function validateKeyScopes(
  req: Request & { publishableApiKeyScopes: PublishableApiKeyScopes },
  res: Response,
  next: NextFunction
) {
  const pubKey = req.get("x-publishable-api-key")

  const publishableKeyService: PublishableApiKeyService = req.scope.resolve(
    "publishableApiKeyService"
  )

  if (pubKey) {
    req.publishableApiKeyScopes = await publishableKeyService.getResourceScopes(
      pubKey
    )
  }

  next()
}

export { validateKeyScopes }
