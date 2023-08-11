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
 * required:
 *   - apps
 * properties:
 *   apps:
 *     description: App details.
 *     $ref: "#/components/schemas/OAuth"
 */
export type AdminAppsRes = {
  apps: Oauth
}

/**
 * @schema AdminAppsListRes
 * type: object
 * required:
 *   - apps
 * properties:
 *   apps:
 *      type: array
 *      description: An array of app details.
 *      items:
 *        $ref: "#/components/schemas/OAuth"
 */
export type AdminAppsListRes = {
  apps: Oauth[]
}
