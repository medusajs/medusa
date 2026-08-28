import {
  AuthIdentityDTO,
  AuthMfaChallengeDTO,
  ConfigModule,
  MedusaContainer,
  ProjectConfigOptions,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  generateJwtToken,
} from "@medusajs/framework/utils"
import { type Secret } from "jsonwebtoken"
import { validateVerification } from "./validate-verification"

export async function generateJwtTokenWithChecks(
  container: MedusaContainer,
  {
    authIdentity,
    mfaChallenge,
    actorType,
    authProvider,
  }: {
    authIdentity: AuthIdentityDTO
    mfaChallenge?: AuthMfaChallengeDTO
    actorType: string
    authProvider: string
  }
) {
  const config: ConfigModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )
  const { http } = config.projectConfig

  const actorlessToken = await generateJwtTokenForAuthIdentity(
    {
      authIdentity,
      actorType: actorType,
      authProvider: authProvider,
      container: container,
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
    container,
    {
      actor_type: actorType,
      auth_provider: authProvider,
      auth_identity: authIdentity,
    }
  )

  if (requiresVerification && !verification?.verified_at) {
    return {
      verification_required: true,
      verification,
      token: actorlessToken,
    }
  }

  if (mfaChallenge) {
    return {
      mfa_required: true,
      mfa_challenge: mfaChallenge,
      token: actorlessToken,
    }
  }

  const token = await generateJwtTokenForAuthIdentity(
    {
      authIdentity,
      actorType: actorType,
      authProvider: authProvider,
      container,
    },
    {
      secret: http.jwtSecret!,
      expiresIn: http.jwtExpiresIn,
      options: http.jwtOptions,
    }
  )

  return { token }
}

export async function generateJwtTokenForAuthIdentity(
  {
    authIdentity,
    actorType,
    authProvider,
    container,
  }: {
    authIdentity: AuthIdentityDTO
    actorType: string
    authProvider?: string
    container?: MedusaContainer
  },
  {
    secret,
    expiresIn,
    skipActorType,
    options,
  }: {
    secret: Secret
    expiresIn: string | undefined
    skipActorType?: boolean
    options?: ProjectConfigOptions["http"]["jwtOptions"]
  }
) {
  const expiresIn_ = expiresIn ?? options?.expiresIn
  const entityIdKey = `${actorType}_id`
  const entityId = skipActorType
    ? undefined
    : (authIdentity?.app_metadata?.[entityIdKey] as string | undefined)

  const providerIdentity = !authProvider
    ? undefined
    : authIdentity.provider_identities?.filter(
        (identity) => identity.provider === authProvider
      )[0]

  return generateJwtToken(
    {
      actor_id: entityId ?? "",
      actor_type: actorType,
      auth_identity_id: authIdentity?.id ?? "",
      ...(authProvider ? { auth_provider: authProvider } : {}),
      app_metadata: {
        ...(authIdentity.app_metadata ?? {}),
        [entityIdKey]: entityId,
      },
      user_metadata: providerIdentity?.user_metadata ?? {},
    },
    {
      secret,
      expiresIn: expiresIn_,
      jwtOptions: options,
    }
  )
}
