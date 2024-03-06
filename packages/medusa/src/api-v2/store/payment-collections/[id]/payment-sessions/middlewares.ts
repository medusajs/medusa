import { transformBody } from "../../../../../api/middlewares"
import { MiddlewareRoute } from "../../../../../loaders/helpers/routing/types"
import { StorePostPaymentCollectionsPaymentSessionReq } from "./validators"

export const storeCartRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/store/payment-collections/:id/payment-sessions",
    middlewares: [transformBody(StorePostPaymentCollectionsPaymentSessionReq)],
  },
]
