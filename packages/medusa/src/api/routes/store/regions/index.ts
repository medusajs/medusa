import { Router } from "express"
import middlewares from "../../../middlewares"
import { Region } from "./../../../../"

const route = Router()

export default (app) => {
  app.use("/regions", route)

  route.get("/", middlewares.wrap(require("./list-regions").default))
  route.get("/:region_id", middlewares.wrap(require("./get-region").default))

  return app
}

/**
 * @schema StoreRegionsListRes
 * type: object
 * properties:
 *   regions:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Region"
 */
export type StoreRegionsListRes = {
  regions: Region[]
}

/**
 * @schema StoreRegionsRes
 * type: object
 * properties:
 *   region:
 *     $ref: "#/components/schemas/Region"
 */
export type StoreRegionsRes = {
  region: Region
}

export * from "./get-region"
export * from "./list-regions"
