import { RouteObject } from "react-router-dom"

/**
 * Experimental V2 routes.
 *
 * These routes are only available if the `medusa_v2` feature flag is enabled.
 * If the flag is not enabled, the user will be redirected to the home page.
 */
export const v2Routes: RouteObject[] = [
  {
    path: "/login",
    lazy: () => import("../../v2-routes/login"),
  },
  {
    path: "*",
    lazy: () => import("../../routes/no-match"),
  },
]
