import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"

export const adminRegionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/regions",
  },
  {
    method: ["GET"],
    matcher: "/admin/regions/:id",
  },
]
