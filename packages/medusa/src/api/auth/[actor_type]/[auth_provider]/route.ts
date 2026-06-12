import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  AuthenticationInput,
  AuthIdentityDTO,
  ConfigModule,
  IAuthModuleService,
  MedusaContainer,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { generateJwtTokenForAuthIdentity } from "../../utils/generate-jwt-token"

const getVerificationIfRequired = async (
  container: MedusaContainer,
  {
    actor_type,
    auth_provider,
    auth_identity,
  }: {
    actor_type: string
    auth_provider: string
    auth_identity: AuthIdentityDTO
  }
) => {
  const config: ConfigModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )
  const service: IAuthModuleService = container.resolve(Modules.AUTH)

  const verifications =
    config.projectConfig.http.authVerificationsPerActor?.[actor_type]

  if (!verifications || verifications.length === 0) {
    return undefined
  }

  const verificationForProvider = verifications.find(
    (verification) => verification.provider === auth_provider
  )

  if (!verificationForProvider) {
    return undefined
  }

  const providerIdentity = auth_identity.provider_identities?.filter(
    (identity) => identity.provider === auth_provider
  )[0]

  if (!providerIdentity) {
    return undefined
  }

  const verification = await service.listAuthVerifications({
    auth_identity_id: auth_identity.id,
    entity_id: providerIdentity.entity_id,
    type: verificationForProvider.type,
  })

  return verification[0]
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { actor_type, auth_provider } = req.params
  const config: ConfigModule = req.scope.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const service: IAuthModuleService = req.scope.resolve(Modules.AUTH)

  const authData = {
    actor_type,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    protocol: req.protocol,
  } as AuthenticationInput

  const { success, error, authIdentity, location, mfa_challenge } =
    await service.authenticate(auth_provider, authData)

  if (location) {
    return res.status(200).json({ location })
  }

  if (success && authIdentity) {
    const verification = await getVerificationIfRequired(req.scope, {
      actor_type,
      auth_provider,
      auth_identity: authIdentity,
    })

    if (verification && !verification.verified_at) {
      return res.status(200).json({
        verification_required: true,
        verification,
      })
    }
  }

  if (success && mfa_challenge) {
    return res.status(200).json({
      mfa_required: true,
      mfa_challenge,
    })
  }

  if (success && authIdentity) {
    const { http } = config.projectConfig

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

    return res.status(200).json({ token })
  }

  throw new MedusaError(
    MedusaError.Types.UNAUTHORIZED,
    error || "Authentication failed"
  )
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  await GET(req, res)
}
