import { MiddlewareRoute } from "@medusajs/framework"
import { authenticate } from "../../utils/middlewares/authenticate-middleware"
import { AdminResetPasswordTokenReq } from "../admin/users/validators"
import { validateAndTransformBody } from "../utils/validate-body"
import { validateScopeProviderAssociation } from "./utils/validate-scope-provider-association"

export const authRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/auth/session",
    middlewares: [authenticate("*", "bearer")],
  },
  {
    method: ["DELETE"],
    matcher: "/auth/session",
    middlewares: [authenticate("*", ["session"])],
  },
  {
    method: ["POST"],
    matcher: "/auth/:actor_type/:auth_provider/callback",
    middlewares: [validateScopeProviderAssociation()],
  },
  {
    method: ["POST"],
    matcher: "/auth/:actor_type/:auth_provider/register",
    middlewares: [validateScopeProviderAssociation()],
  },
  {
    method: ["POST"],
    matcher: "/auth/:actor_type/:auth_provider",
    middlewares: [validateScopeProviderAssociation()],
  },
  {
    method: ["GET"],
    matcher: "/auth/:actor_type/:auth_provider",
    middlewares: [validateScopeProviderAssociation()],
  },
  {
    method: ["POST"],
    matcher: "/auth/:actor_type/:auth_provider/reset-password",
    middlewares: [
      validateAndTransformBody(AdminResetPasswordTokenReq),
      validateScopeProviderAssociation(),
    ],
  },
  // {
  //   method: ["POST"],
  //   matcher: "/auth/:actor_type/:auth_provider/reset-password",
  //   middlewares: [
  //     validateAndTransformBody(AdminResetPasswordReq),
  //     validateScopeProviderAssociation()
  //   ],
  // },
]
