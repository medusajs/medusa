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

export type AdminAppsRes = {
  apps: Oauth
}

export type AdminAppsListRes = {
  apps: Oauth[]
}
