import { MiddlewaresConfig } from "../loaders/helpers/routing/types"
import { adminCampaignRoutesMiddlewares } from "./admin/campaigns/middlewares"
import { adminCustomerGroupRoutesMiddlewares } from "./admin/customer-groups/middlewares"
import { storeCustomerRoutesMiddlewares } from "./store/customers/middlewares"
import { adminCustomerRoutesMiddlewares } from "./admin/customers/middlewares"
import { adminPromotionRoutesMiddlewares } from "./admin/promotions/middlewares"
import { storeCartRoutesMiddlewares } from "./store/carts/middlewares"
import { authRoutesMiddlewares } from "./auth/middlewares"

export const config: MiddlewaresConfig = {
  routes: [
    ...adminCustomerGroupRoutesMiddlewares,
    ...adminCustomerRoutesMiddlewares,
    ...adminPromotionRoutesMiddlewares,
    ...adminCampaignRoutesMiddlewares,
    ...storeCustomerRoutesMiddlewares,
    ...storeCartRoutesMiddlewares,
    ...authRoutesMiddlewares,
  ],
}
