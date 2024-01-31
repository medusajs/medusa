import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { StorePostCustomersReq } from "./validators"
import authenticate from "../../../utils/authenticate-middleware"
import { transformBody } from "../../../api/middlewares"

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
  // {
  //   method: ["GET"],
  //   matcher: "/store/customers/me",
  //   middlewares: [
  //     passport.authenticate("customRoute", {
  //       scope: "store",
  //     }),
  //   ],
  // },
  // {
  //   method: ["GET"],
  //   matcher: "/store/customers/me/admin",
  //   middlewares: [
  //     passport.authenticate("customRoute", {
  //       scope: "admin",
  //     }),
  //   ],
  // },
]
