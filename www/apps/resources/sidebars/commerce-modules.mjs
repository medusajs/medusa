import { apiKeySidebar } from "./api-key.mjs"
import { authSidebar } from "./auth.mjs"
import { cartSidebar } from "./cart.mjs"
import { currencySidebar } from "./currency.mjs"
import { customerSidebar } from "./customer.mjs"
import { fulfillmentSidebar } from "./fulfillment.mjs"
import { inventorySidebar } from "./inventory.mjs"
import { orderSidebar } from "./order-module.mjs"
import { paymentSidebar } from "./payment.mjs"
import { pricingSidebar } from "./pricing.mjs"
import { productSidebar } from "./product.mjs"
import { promotionSidebar } from "./promotion.mjs"
import { regionSidebar } from "./region.mjs"
import { salesChannelSidebar } from "./sales-channel.mjs"
import { stockLocationSidebar } from "./stock-location.mjs"
import { storeSidebar } from "./store.mjs"
import { taxSidebar } from "./tax.mjs"
import { translationSidebar } from "./translation.mjs"
import { userSidebar } from "./user.mjs"

/** @type {import('types').Sidebar.SidebarItem[]} */
export const commerceModulesSidebar = [
  {
    type: "link",
    title: "Overview",
    path: "/commerce-modules",
  },
  {
    type: "separator",
  },
  ...apiKeySidebar,
  ...authSidebar,
  ...cartSidebar,
  ...currencySidebar,
  ...customerSidebar,
  ...fulfillmentSidebar,
  ...inventorySidebar,
  ...orderSidebar,
  ...paymentSidebar,
  ...pricingSidebar,
  ...productSidebar,
  ...promotionSidebar,
  ...regionSidebar,
  ...salesChannelSidebar,
  ...stockLocationSidebar,
  ...storeSidebar,
  ...taxSidebar,
  ...translationSidebar,
  ...userSidebar,
]
