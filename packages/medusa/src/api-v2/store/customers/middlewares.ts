import { transformBody } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { StorePostCustomersReq } from "./validators"
import authenticate from "../../../utils/authenticate-middleware"

export const storeCustomerRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: "ALL",
    matcher: "/store/customers*",
    middlewares: [authenticate("store", ["session", "bearer"])],
  },
  {
    method: ["POST"],
    matcher: "/store/customers",
    middlewares: [transformBody(StorePostCustomersReq)],
  },
  {
    method: ["GET"],
    matcher: "/store/customers/me",
    middlewares: [],
  },
]
