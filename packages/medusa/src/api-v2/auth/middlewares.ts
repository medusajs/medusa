import { MiddlewareRoute } from "../../loaders/helpers/routing/types"

export const adminCampaignRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/auth/:scope/:auth-provider",
    middlewares: [],
  },
]
