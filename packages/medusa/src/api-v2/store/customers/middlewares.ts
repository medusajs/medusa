import { transformBody } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import passport from "passport"
import { StorePostCustomersReq } from "./validators"

export const storeCustomerRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/store/customers",
    middlewares: [transformBody(StorePostCustomersReq)],
  },
  {
    method: ["GET"],
    matcher: "/store/customers/me",
    middlewares: [
      passport.authenticate("customRoute", {
        scope: "store",
      }),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/customers/me/admin",
    middlewares: [
      passport.authenticate("customRoute", {
        scope: "admin",
      }),
    ],
  },
]
