import { MiddlewaresConfig } from "../loaders/helpers/routing/types"
import { adminPromotionRoutesMiddlewares } from "./admin/promotions/middlewares"

export const config: MiddlewaresConfig = {
  routes: [...adminPromotionRoutesMiddlewares],
}
