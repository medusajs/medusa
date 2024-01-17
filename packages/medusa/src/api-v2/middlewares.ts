import { MiddlewaresConfig } from "../loaders/helpers/routing/types"
import { adminPromotionRoutesMiddleware } from "./admin/promotions/middleware"

export const config: MiddlewaresConfig = {
  routes: [adminPromotionRoutesMiddleware],
}
