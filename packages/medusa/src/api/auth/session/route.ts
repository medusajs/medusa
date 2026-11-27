import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { hasEnabledMfa } from "../utils/generate-jwt-token"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  // Read from the database, not the token, so a token issued before MFA was
  // enabled can't be turned into a session that skips MFA.
  const authContext = {
    ...req.auth_context,
    mfa_enabled: await hasEnabledMfa(
      req.scope,
      req.auth_context.auth_identity_id
    ),
  }

  req.session.auth_context = authContext

  res.status(200).json({ user: authContext })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { sessionOptions, cookieOptions } = req.scope
    .resolve(ContainerRegistrationKeys.CONFIG_MODULE)
    .projectConfig

  const cookieName = sessionOptions?.name ?? "connect.sid"

  try {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => (err ? reject(err) : resolve()))
    })
  } finally {
    res.clearCookie(cookieName, cookieOptions)
  }

  res.json({ success: true })
}
