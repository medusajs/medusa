import { Return } from "./../../../../models/return"
import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/returns", route)

  route.post("/", middlewares.wrap(require("./create-return").default))

  return app
}

export const defaultRelations = ["items", "items.reason"]

/**
 * @schema StoreReturnsRes
 * type: object
 * x-expanded-relations:
 *   field: return
 *   relations:
 *     - items
 *     - items.reason
 *   eager:
 *     - items
 * required:
 *   - return
 * properties:
 *   return:
 *     $ref: "#/components/schemas/Return"
 */
export type StoreReturnsRes = {
  return: Return
}

export * from "./create-return"
