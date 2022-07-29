import { Router } from "express"
import { User } from "../../../.."
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/auth", route)

  route.get("/", middlewares.authenticate(), require("./get-session").default)
  route.post("/", require("./create-session").default)

  route.delete(
    "/",
    middlewares.authenticate(),
    require("./delete-session").default
  )

  return app
}

export type AdminAuthRes = {
  user: Omit<User, "password_hash">
}

export * from "./create-session"
export * from "./delete-session"
export * from "./get-session"
