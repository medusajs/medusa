import {
  authenticate,
  MiddlewareRoute,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { validateScopeProviderAssociation } from "./utils/validate-scope-provider-association"
import { validateToken } from "./utils/validate-token"
import {
  AuthMfaCreateFactorRequest,
  AuthMfaDisableFactorRequest,
  AuthMfaGenerateRecoveryCodesRequest,
  AuthMfaVerifyChallengeRequest,
  AuthMfaVerifyFactorRequest,
  VerificationConfirmRequest,
  VerificationRequest,
  ResetPasswordRequest,
} from "./validators"

export const authRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/auth/session",
    middlewares: [authenticate("*", "bearer", { allowUnregistered: true })],
  },
  {
    method: ["DELETE"],
    matcher: "/auth/session",
    middlewares: [authenticate("*", ["session"])],
  },
  {
    method: ["POST"],
    matcher: "/auth/token/refresh",
    middlewares: [authenticate("*", "bearer", { allowUnregistered: true })],
  },
  {
    method: ["POST"],
    matcher: "/auth/mfa/challenges/:id/verify",
    middlewares: [validateAndTransformBody(AuthMfaVerifyChallengeRequest)],
  },
  {
    method: ["GET"],
    matcher: "/auth/mfa/factors",
    middlewares: [authenticate("*", ["session", "bearer"])],
  },
  {
    method: ["POST"],
    matcher: "/auth/mfa/factors",
    middlewares: [
      authenticate("*", ["session", "bearer"]),
      validateAndTransformBody(AuthMfaCreateFactorRequest),
    ],
  },
  {
    method: ["POST"],
    matcher: "/auth/mfa/factors/:id/verify",
    middlewares: [
      authenticate("*", ["session", "bearer"]),
      validateAndTransformBody(AuthMfaVerifyFactorRequest),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/auth/mfa/factors/:id",
    middlewares: [
      authenticate("*", ["session", "bearer"]),
      validateAndTransformBody(AuthMfaDisableFactorRequest),
    ],
  },
  {
    method: ["POST"],
    matcher: "/auth/mfa/recovery-codes",
    middlewares: [
      authenticate("*", ["session", "bearer"]),
      validateAndTransformBody(AuthMfaGenerateRecoveryCodesRequest),
    ],
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
      validateScopeProviderAssociation(),
      validateAndTransformBody(ResetPasswordRequest),
    ],
  },
  {
    method: ["POST"],
    matcher: "/auth/:actor_type/:auth_provider/verification/request",
    middlewares: [
      validateScopeProviderAssociation(),
      validateAndTransformBody(VerificationRequest),
    ],
  },
  {
    method: ["POST"],
    matcher: "/auth/:actor_type/:auth_provider/verification/confirm",
    middlewares: [
      validateScopeProviderAssociation(),
      validateAndTransformBody(VerificationConfirmRequest),
    ],
  },
  {
    method: ["POST"],
    matcher: "/auth/:actor_type/:auth_provider/update",
    middlewares: [validateScopeProviderAssociation(), validateToken()],
  },
]
