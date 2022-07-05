/* eslint-disable @typescript-eslint/no-empty-function */
import { Router } from "express"
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"
import "reflect-metadata"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"

const route = Router()

export default (app) => {
  app.use("/sales-channels", isFeatureFlagEnabled("sales_channels"), route)

  route.get("/:id", (req, res) => {})

  route.get("/", (req, res) => {})

  route.post("/", (req, res) => {})

  route.post("/:id", (req, res) => {})

  route.delete("/:id", (req, res) => {})

  return app
}

export type AdminSalesChanenlRes = {
  sales_channel: any
}

export type AdminSalesChannelDeleteRes = DeleteResponse

export type AdminSalesChannelListRes = PaginatedResponse & {
  sales_channels: any[]
}

// export * from './'
// export * from './'
// export * from './'
// export * from './'
// export * from './'
