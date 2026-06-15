import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  AuthenticationInput,
  ConfigModule,
  IAuthModuleService,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { generateJwtTokenForAuthIdentity } from "../../../utils/generate-jwt-token"
import { validateVerification } from "../../../utils/validate-verification"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { actor_type, auth_provider } = req.params

  const config: ConfigModule = req.scope.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )
  const { http } = config.projectConfig
  const service: IAuthModuleService = req.scope.resolve(Modules.AUTH)

  const authData = {
    actor_type,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    protocol: req.protocol,
  } as AuthenticationInput

  const { success, error, authIdentity, mfa_challenge } =
    await service.validateCallback(auth_provider, authData)

  if (success && authIdentity) {
    const actorlessToken = await generateJwtTokenForAuthIdentity(
      {
        authIdentity,
        actorType: actor_type,
        authProvider: auth_provider,
        container: req.scope,
      },
      {
        secret: http.jwtSecret!,
        expiresIn: http.jwtExpiresIn,
        // Running a verification is about the auth identity, so we return a token to be able to authenticate the requests
        // without having an actor tied to it until the verification is completed.
        skipActorType: true,
        options: http.jwtOptions,
      }
    )

    // Check if verification of the provider entity data is required (such as email verification)
    const { requiresVerification, verification } = await validateVerification(
      req.scope,
      {
        actor_type,
        auth_provider,
        auth_identity: authIdentity,
      }
    )

    if (requiresVerification && !verification?.verified_at) {
      return res.status(200).json({
        verification_required: true,
        verification,
        token: actorlessToken,
      })
    }

    if (mfa_challenge) {
      return res.status(200).json({
        mfa_required: true,
        mfa_challenge,
        token: actorlessToken,
      })
    }

    const token = await generateJwtTokenForAuthIdentity(
      {
        authIdentity,
        actorType: actor_type,
        authProvider: auth_provider,
        container: req.scope,
      },
      {
        secret: http.jwtSecret!,
        expiresIn: http.jwtExpiresIn,
        options: http.jwtOptions,
      }
    )

    return res.json({ token })
  }

  throw new MedusaError(
    MedusaError.Types.UNAUTHORIZED,
    error || "Authentication failed"
  )
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  await GET(req, res)
}
