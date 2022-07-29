import { Router } from "express"
import { Oauth } from "../../../.."

const route = Router()

export default (app) => {
  app.use("/apps", route)

  route.get("/", require("./list").default)
  route.post("/authorizations", require("./authorize-app").default)

  return app
}

export type AdminAppsRes = {
  apps: Oauth
}

export type AdminAppsListRes = {
  apps: Oauth[]
}
