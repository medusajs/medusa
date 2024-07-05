import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"

export const storeShippingOptionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/shipping-options/:cart_id",
    middlewares: [],
  },
]
