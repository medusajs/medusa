import { PromotionDTO } from "@medusajs/types"
import { MedusaV2Flag, wrapHandler } from "@medusajs/utils"
import { Express, Router } from "express"
import { PaginatedResponse } from "../../../../types/common"
import { transformQuery } from "../../../middlewares"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"
import listPromotions, { AdminGetPromotionsParams } from "./list-promotions"

const route = Router()

export default (app: Express) => {
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

  app.use("/promotions", isFeatureFlagEnabled(MedusaV2Flag.key), route)

  route.get(
    "/",
    transformQuery(AdminGetPromotionsParams, listTransformQueryConfig),
    wrapHandler(listPromotions)
  )

  return app
}

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

export type AdminPromotionsListRes = PaginatedResponse & {
  promotions: PromotionDTO[]
}
