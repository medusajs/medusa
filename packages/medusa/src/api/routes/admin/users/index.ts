import { Router } from "express"
import { User } from "../../../.."
import { DeleteResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"

export const unauthenticatedUserRoutes = (app) => {
  const route = Router()
  app.use("/users", route)

  route.post(
    "/password-token",
    middlewares.wrap(require("./reset-password-token").default)
  )

  route.post(
    "/reset-password",
    middlewares.wrap(require("./reset-password").default)
  )
}

export default (app) => {
  const route = Router()
  app.use("/users", route)

  route.get("/:user_id", middlewares.wrap(require("./get-user").default))

  route.post("/", middlewares.wrap(require("./create-user").default))

  route.post("/:user_id", middlewares.wrap(require("./update-user").default))

  route.delete("/:user_id", middlewares.wrap(require("./delete-user").default))

  route.get("/", middlewares.wrap(require("./list-users").default))

  return app
}

/**
 * @schema AdminUserRes
 * type: object
 * required:
 *   - user
 * properties:
 *   user:
 *     $ref: "#/components/schemas/User"
 */
export type AdminUserRes = {
  user: Omit<User, "password_hash">
}

/**
 * @schema AdminUsersListRes
 * type: object
 * required:
 *   - users
 * properties:
 *   users:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/User"
 */
export type AdminUsersListRes = {
  users: Omit<User, "password_hash">[]
}

/**
 * @schema AdminDeleteUserRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted user.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: user
 *   deleted:
 *     type: boolean
 *     description: Whether or not the items were deleted.
 *     default: true
 */
export type AdminDeleteUserRes = DeleteResponse

export * from "./reset-password"
export * from "./reset-password-token"

export * from "./create-user"
export * from "./delete-user"
export * from "./get-user"
export * from "./list-users"
export * from "./update-user"
