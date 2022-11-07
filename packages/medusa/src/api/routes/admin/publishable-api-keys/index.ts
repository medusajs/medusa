import { Router } from "express"

import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"
import PublishableAPIKeysFeatureFlag from "../../../../loaders/feature-flags/publishable-api-keys"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use(
    "/publishable-api-keys",
    isFeatureFlagEnabled(PublishableAPIKeysFeatureFlag.key),
    route
  )

  route.post(
    "/",
    middlewares.wrap(require("./create-publishable-api-key").default)
  )

  route.get(
    "/:id",
    middlewares.wrap(require("./get-publishable-api-key").default)
  )

  route.post(
    "/:id/confirm",
    middlewares.wrap(require("./revoke-publishable-api-key").default)
  )
}
