import { Router } from "express"
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import "reflect-metadata"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"
import { SalesChannel } from "../../../../models"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/sales-channels", isFeatureFlagEnabled("sales_channels"), route)

  const salesChannelRouter = Router({ mergeParams: true })
  route.use("/:id", salesChannelRouter)

  salesChannelRouter.get(
    "/",
    middlewares.wrap(require("./get-sales-channel").default)
  )

  route.get("/", (req, res) => {})

  route.post("/", (req, res) => {})

  route.post("/:id", (req, res) => {})

  route.delete("/:id", (req, res) => {})

  return app
}

export type AdminSalesChannelRes = {
  sales_channel: SalesChannel
}

export type AdminSalesChannelDeleteRes = DeleteResponse

export type AdminSalesChannelListRes = PaginatedResponse & {
  sales_channels: SalesChannel[]
}

export * from "./get-sales-channel"
// export * from './'
// export * from './'
// export * from './'
// export * from './'
