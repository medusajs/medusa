import { MedusaV2Flag } from "@medusajs/utils"
import { isFeatureFlagEnabled, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { AdminGetPromotionsParams } from "./route"

export const defaultAdminPromotionRelations = ["campaign", "application_method"]
export const allowedAdminPromotionRelations = [
  ...defaultAdminPromotionRelations,
]
export const defaultPromotionFields = [
  "id",
  "code",
  "campaign",
  "is_automatic",
  "type",
  "created_at",
  "updated_at",
  "deleted_at",
]

const retrieveTransformQueryConfig = {
  defaultFields: defaultPromotionFields,
  defaultRelations: defaultAdminPromotionRelations,
  allowedRelations: allowedAdminPromotionRelations,
  isList: false,
}

const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}

export const promotionsRouteMiddleware: MiddlewareRoute = {
  method: ["GET"],
  matcher: "/admin/promotions*",
  middlewares: [
    isFeatureFlagEnabled(MedusaV2Flag.key),
    transformQuery(AdminGetPromotionsParams, listTransformQueryConfig),
  ],
}
