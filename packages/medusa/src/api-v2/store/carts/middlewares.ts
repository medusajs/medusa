import { transformBody, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import { StorePostCartsCartLineItemsReq } from "./[id]/line-items/validators"
import * as QueryConfig from "./query-config"
import {
  StoreDeleteCartsCartPromotionsReq,
  StoreGetCartsCartParams,
  StorePostCartReq,
  StorePostCartsCartPromotionsReq,
  StorePostCartsCartReq,
} from "./validators"

export const storeCartRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: "ALL",
    matcher: "/store/carts*",
    middlewares: [
      authenticate("store", ["session", "bearer"], {
        allowUnauthenticated: true,
      }),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/carts/:id",
    middlewares: [
      transformQuery(
        StoreGetCartsCartParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/carts",
    middlewares: [transformBody(StorePostCartReq)],
  },
  {
    method: ["POST"],
    matcher: "/store/carts/:id",
    middlewares: [transformBody(StorePostCartsCartReq)],
  },
  {
    method: ["POST"],
    matcher: "/store/carts/:id/line-items",
    middlewares: [transformBody(StorePostCartsCartLineItemsReq)],
  },
  {
    method: ["POST"],
    matcher: "/store/carts/:id/promotions",
    middlewares: [transformBody(StorePostCartsCartPromotionsReq)],
  },
  {
    method: ["DELETE"],
    matcher: "/store/carts/:id/promotions",
    middlewares: [transformBody(StoreDeleteCartsCartPromotionsReq)],
  },
]
