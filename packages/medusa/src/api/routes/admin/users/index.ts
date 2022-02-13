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
export type AdminUserRes = {
  user: Omit<User, "password_hash">
}

export type AdminUsersListRes = {
  users: Omit<User, "password_hash">[]
}

export type AdminDeleteUserRes = DeleteResponse

export * from "./reset-password"
export * from "./reset-password-token"

export * from "./create-user"
export * from "./delete-user"
export * from "./get-user"
export * from "./list-users"
export * from "./update-user"
