import { NextFunction, RequestHandler } from "express"
import { MedusaRequest, MedusaResponse } from "../types"

/**
 * Creates a middleware that adds fields and relations to the list of fields that
 * can be queried through the `fields` query parameter of the routes it's applied to.
 *
 * Use it to expose fields that aren't part of a route's allowed fields, such as
 * links added by a plugin or module.
 *
 * @param fields - The fields and relations to allow. Accepts both single fields and arrays of fields.
 *
 * @example
 * import { allowFields, defineMiddlewares } from "@medusajs/framework/http"
 *
 * export default defineMiddlewares({
 *   routes: [
 *     {
 *       matcher: "/store/products",
 *       middlewares: [allowFields("brand", "brand.*")],
 *     },
 *   ],
 * })
 */
export const allowFields = (
  ...fields: (string | string[])[]
): RequestHandler => {
  const fieldsToAllow = fields.flat()

  return ((
    req: MedusaRequest,
    _res: MedusaResponse,
    next: NextFunction
  ): void => {
    req.allowed.push(...fieldsToAllow)

    next()
  }) as unknown as RequestHandler
}
