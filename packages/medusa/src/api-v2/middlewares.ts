import { MiddlewaresConfig } from "../loaders/helpers/routing/types"
import { adminCampaignRoutesMiddlewares } from "./admin/campaigns/middlewares"
import { adminPromotionRoutesMiddlewares } from "./admin/promotions/middlewares"
import { authRoutesMiddlewares } from "./auth/middlewares"
import { storeCustomerRoutesMiddlewares } from "./store/customers/middlewares"
import { adminCustomerRoutesMiddlewares } from "./admin/customers/middlewares"
import { adminCustomerGroupRoutesMiddlewares } from "./admin/customer-groups/middlewares"
import { storeCartRoutesMiddlewares } from "./store/carts/middlewares"

export const config: MiddlewaresConfig = {
  routes: [
    ...adminCustomerGroupRoutesMiddlewares,
    ...adminCustomerRoutesMiddlewares,
    ...adminPromotionRoutesMiddlewares,
    ...adminCampaignRoutesMiddlewares,
    ...storeCustomerRoutesMiddlewares,
    ...authRoutesMiddlewares,
    ...storeCartRoutesMiddlewares,
  ],
}
