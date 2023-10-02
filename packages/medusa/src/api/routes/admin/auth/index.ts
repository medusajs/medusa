import { Router } from "express"
import { User } from "../../../.."
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/auth", route)

  route.get(
    "/",
    middlewares.authenticate(),
    middlewares.wrap(require("./get-session").default)
  )

  route.post("/", middlewares.wrap(require("./create-session").default))

  route.delete(
    "/",
    middlewares.authenticate(),
    middlewares.wrap(require("./delete-session").default)
  )

  route.post("/token", middlewares.wrap(require("./get-token").default))

  return app
}

/**
 * @schema AdminAuthRes
 * type: object
 * required:
 *   - user
 * properties:
 *   user:
 *     description: User details.
 *     $ref: "#/components/schemas/User"
 */
export type AdminAuthRes = {
  user: Omit<User, "password_hash">
}

/**
 * @schema AdminBearerAuthRes
 * type: object
 * properties:
 *   accessToken:
 *     description: Access token for subsequent authorization.
 *     type: string
 */
export type AdminBearerAuthRes = {
  access_token: string
}

export * from "./create-session"
export * from "./delete-session"
export * from "./get-session"
export * from "./get-token"
