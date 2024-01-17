import { MiddlewaresConfig } from "../loaders/helpers/routing/types"
import { promotionsRouteMiddleware } from "./admin/promotions/middleware"

export const config: MiddlewaresConfig = {
  routes: [promotionsRouteMiddleware],
}
