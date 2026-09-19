import { NextFunction, RequestHandler } from "express"
import { MedusaRequest, MedusaResponse } from "../types"

/**
 * What {@link allowSearchIndexes} adds to the request. Only `POST /store/search`
 * reads it, so it is intersected into that route's request rather than carried
 * by every `MedusaRequest`.
 */
export type AllowedSearchIndexes = {
  allowedSearchIndexes?: string[]
}

/**
 * Creates a middleware that opts search indexes into `POST /store/search`.
 *
 * Nothing is searchable there until a middleware allows it: which of a store's
 * indexes a storefront may reach is a decision the store makes server-side, so
 * it is never something the request can ask for.
 *
 * Several middlewares can each contribute, so a plugin can expose its own index
 * without discarding what the app allowed.
 *
 * @param indexes - The names of the indexes to expose. Accepts both single names
 * and arrays of names.
 *
 * @example
 * import { allowSearchIndexes, defineMiddlewares } from "@medusajs/framework/http"
 *
 * export default defineMiddlewares({
 *   routes: [
 *     {
 *       matcher: "/store/search",
 *       middlewares: [allowSearchIndexes("product")],
 *     },
 *   ],
 * })
 */
export const allowSearchIndexes = (
  ...indexes: (string | string[])[]
): RequestHandler => {
  const indexesToAllow = indexes.flat()

  return ((
    req: MedusaRequest & AllowedSearchIndexes,
    _res: MedusaResponse,
    next: NextFunction
  ): void => {
    req.allowedSearchIndexes = [
      ...(req.allowedSearchIndexes ?? []),
      ...indexesToAllow,
    ]

    next()
  }) as unknown as RequestHandler
}
