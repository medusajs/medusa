import { MiddlewaresConfig } from "../loaders/helpers/routing/types"
import { adminApiKeyRoutesMiddlewares } from "./admin/api-keys/middlewares"
import { adminCampaignRoutesMiddlewares } from "./admin/campaigns/middlewares"
import { adminCustomerGroupRoutesMiddlewares } from "./admin/customer-groups/middlewares"
import { adminCustomerRoutesMiddlewares } from "./admin/customers/middlewares"
import { adminInviteRoutesMiddlewares } from "./admin/invites/middlewares"
import { adminPromotionRoutesMiddlewares } from "./admin/promotions/middlewares"
import { adminRegionRoutesMiddlewares } from "./admin/regions/middlewares"
import { adminTaxRegionRoutesMiddlewares } from "./admin/tax-regions/middlewares"
import { adminStoreRoutesMiddlewares } from "./admin/stores/middlewares"
import { adminTaxRateRoutesMiddlewares } from "./admin/tax-rates/middlewares"
import { adminUserRoutesMiddlewares } from "./admin/users/middlewares"
import { adminWorkflowsExecutionsMiddlewares } from "./admin/workflows-executions/middlewares"
import { authRoutesMiddlewares } from "./auth/middlewares"
import { storeCartRoutesMiddlewares } from "./store/carts/middlewares"
import { storeCustomerRoutesMiddlewares } from "./store/customers/middlewares"
import { storeRegionRoutesMiddlewares } from "./store/regions/middlewares"
import { hooksRoutesMiddlewares } from "./hooks/middlewares"

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
    ...adminTaxRateRoutesMiddlewares,
    ...adminTaxRegionRoutesMiddlewares,
    ...adminApiKeyRoutesMiddlewares,
    ...hooksRoutesMiddlewares,
    ...adminStoreRoutesMiddlewares,
  ],
}
