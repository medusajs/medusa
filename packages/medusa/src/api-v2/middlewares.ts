import { MiddlewaresConfig } from "../loaders/helpers/routing/types"
import { adminCampaignRoutesMiddlewares } from "./admin/campaigns/middlewares"
import { adminCustomerGroupRoutesMiddlewares } from "./admin/customer-groups/middlewares"
import { adminCustomerRoutesMiddlewares } from "./admin/customers/middlewares"
import { adminPromotionRoutesMiddlewares } from "./admin/promotions/middlewares"
import { adminRegionRoutesMiddlewares } from "./admin/regions/middlewares"
import { adminWorkflowsExecutionsMiddlewares } from "./admin/workflows-executions/middlewares"
import { authRoutesMiddlewares } from "./auth/middlewares"
import { storeCartRoutesMiddlewares } from "./store/carts/middlewares"
import { storeCustomerRoutesMiddlewares } from "./store/customers/middlewares"
import { adminUserRoutesMiddlewares } from "./admin/users/middlewares"
import { storeRegionRoutesMiddlewares } from "./store/regions/middlewares"
import { adminInviteRoutesMiddlewares } from "./admin/invites/middlewares"
import { hooksRoutesMiddlewares } from "./hooks/payment/middlewares"

export const config: MiddlewaresConfig = {
  routes: [
    ...adminCustomerGroupRoutesMiddlewares,
    ...adminCustomerRoutesMiddlewares,
    ...adminPromotionRoutesMiddlewares,
    ...adminCampaignRoutesMiddlewares,
    ...storeCartRoutesMiddlewares,
    ...storeCustomerRoutesMiddlewares,
    ...storeCartRoutesMiddlewares,
    ...authRoutesMiddlewares,
    ...adminWorkflowsExecutionsMiddlewares,
    ...storeRegionRoutesMiddlewares,
    ...adminRegionRoutesMiddlewares,
    ...adminUserRoutesMiddlewares,
    ...adminInviteRoutesMiddlewares,
    ...hooksRoutesMiddlewares,
  ],
}
