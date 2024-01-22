import { MiddlewaresConfig } from "../loaders/helpers/routing/types"
import { adminCampaignRoutesMiddlewares } from "./admin/campaigns/middlewares"
import { adminPromotionRoutesMiddlewares } from "./admin/promotions/middlewares"

export const config: MiddlewaresConfig = {
  routes: [
    ...adminPromotionRoutesMiddlewares,
    ...adminCampaignRoutesMiddlewares,
  ],
}
