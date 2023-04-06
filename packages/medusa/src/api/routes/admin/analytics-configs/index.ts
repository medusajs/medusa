import { Router } from "express"
import { AnalyticsConfig } from "../../../.."
import { DeleteResponse } from "../../../../types/common"
import middlewares, { transformBody } from "../../../middlewares"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"
import { AdminPostAnalyticsConfigReq } from "./create-analytics-config"
import { AdminPostAnalyticsConfigAnalyticsConfigReq } from "./update-analytics-config"

const route = Router()

export default (app: Router) => {
  app.use("/analytics-configs", isFeatureFlagEnabled("analytics"), route)

  route.get("/", middlewares.wrap(require("./get-analytics-config").default))

  route.post(
    "/",
    transformBody(AdminPostAnalyticsConfigReq),
    middlewares.wrap(require("./create-analytics-config").default)
  )

  route.post(
    "/update",
    transformBody(AdminPostAnalyticsConfigAnalyticsConfigReq),
    middlewares.wrap(require("./update-analytics-config").default)
  )

  route.delete(
    "/",
    middlewares.wrap(require("./delete-analytics-config").default)
  )

  return app
}

export type AdminAnalyticsConfigRes = {
  analytics_config: AnalyticsConfig
}

export type AdminAnalyticsConfigDeleteRes = DeleteResponse

export * from "./create-analytics-config"
export * from "./update-analytics-config"
