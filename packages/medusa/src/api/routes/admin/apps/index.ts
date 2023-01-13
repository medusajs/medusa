import { Router } from "express"
import { Oauth } from "../../../.."
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/apps", route)

  route.get("/", middlewares.wrap(require("./list").default))
  route.post(
    "/authorizations",
    middlewares.wrap(require("./authorize-app").default)
  )

  return app
}

/**
 * @schema AdminAppsRes
 * type: object
 * properties:
 *   apps:
 *     $ref: "#/components/schemas/OAuth"
 */
export type AdminAppsRes = {
  apps: Oauth
}

/**
 * @schema AdminAppsListRes
 * type: object
 * properties:
 *   apps:
 *      type: array
 *      items:
 *        $ref: "#/components/schemas/OAuth"
 */
export type AdminAppsListRes = {
  apps: Oauth[]
}
