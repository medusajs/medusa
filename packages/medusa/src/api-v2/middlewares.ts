import { MiddlewaresConfig } from "../loaders/helpers/routing/types"
import { authenticate } from "../utils/authenticate-middleware"
import { adminApiKeyRoutesMiddlewares } from "./admin/api-keys/middlewares"
import { adminCampaignRoutesMiddlewares } from "./admin/campaigns/middlewares"
import { adminCurrencyRoutesMiddlewares } from "./admin/currencies/middlewares"
import { adminCustomerGroupRoutesMiddlewares } from "./admin/customer-groups/middlewares"
import { adminCustomerRoutesMiddlewares } from "./admin/customers/middlewares"
import { adminInviteRoutesMiddlewares } from "./admin/invites/middlewares"
import { adminPaymentRoutesMiddlewares } from "./admin/payments/middlewares"
import { adminPriceListsRoutesMiddlewares } from "./admin/price-lists/middlewares"
import { adminProductRoutesMiddlewares } from "./admin/products/middlewares"
import { adminPromotionRoutesMiddlewares } from "./admin/promotions/middlewares"
import { adminRegionRoutesMiddlewares } from "./admin/regions/middlewares"
import { adminStoreRoutesMiddlewares } from "./admin/stores/middlewares"
import { adminTaxRateRoutesMiddlewares } from "./admin/tax-rates/middlewares"
import { adminTaxRegionRoutesMiddlewares } from "./admin/tax-regions/middlewares"
import { adminUserRoutesMiddlewares } from "./admin/users/middlewares"
import { adminWorkflowsExecutionsMiddlewares } from "./admin/workflows-executions/middlewares"
import { authRoutesMiddlewares } from "./auth/middlewares"
import { hooksRoutesMiddlewares } from "./hooks/middlewares"
import { storeCartRoutesMiddlewares } from "./store/carts/middlewares"
import { storeCurrencyRoutesMiddlewares } from "./store/currencies/middlewares"
import { storeCustomerRoutesMiddlewares } from "./store/customers/middlewares"
import { storeRegionRoutesMiddlewares } from "./store/regions/middlewares"

export const config: MiddlewaresConfig = {
  routes: [
    {
      method: ["ALL"],
      matcher: "/admin/*",
      middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
    },
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
    ...adminCurrencyRoutesMiddlewares,
    ...storeCurrencyRoutesMiddlewares,
    ...adminProductRoutesMiddlewares,
    ...adminPaymentRoutesMiddlewares,
    ...adminPriceListsRoutesMiddlewares,
  ],
}
