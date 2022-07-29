import { Router } from "express"
import { Region } from "./../../../../"

const route = Router()

export default (app) => {
  app.use("/regions", route)

  route.get("/", require("./list-regions").default)
  route.get("/:region_id", require("./get-region").default)

  return app
}

export type StoreRegionsListRes = {
  regions: Region[]
}

export type StoreRegionsRes = {
  region: Region
}

export * from "./get-region"
export * from "./list-regions"
