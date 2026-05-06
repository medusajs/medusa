import { defineMiddlewares } from "@medusajs/framework";
import { adminGiftCardMiddlewares } from "./admin/gift-cards/middlewares";
import { adminStoreCreditAccountMiddlewares } from "./admin/store-credit-accounts/middlewares";
import { storeCartMiddlewares } from "./store/carts/middlewares";
import { storeGiftCardsMiddlewares } from "./store/gift-cards/middlewares";
import { storeStoreCreditAccountMiddlewares } from "./store/store-credit-accounts/middlewares";

export default defineMiddlewares({
  routes: [
    ...adminGiftCardMiddlewares,
    ...storeGiftCardsMiddlewares,
    ...adminStoreCreditAccountMiddlewares,
    ...storeStoreCreditAccountMiddlewares,
    ...storeCartMiddlewares,
  ],
});
