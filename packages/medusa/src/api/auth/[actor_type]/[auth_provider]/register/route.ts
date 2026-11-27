import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  AuthenticationInput,
  ConfigModule,
  IAuthModuleService,
} from "@medusajs/framework/types"
import { requestVerificationWorkflow } from "@medusajs/core-flows"
import {
  AuthWorkflowEvents,
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { generateJwtTokenForAuthIdentity } from "../../../utils/generate-jwt-token"
import { getVerificationHidingExistingIdentities } from "../../../utils/hide-existing-identities"
import { validateVerification } from "../../../utils/validate-verification"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { actor_type, auth_provider } = req.params

  const service: IAuthModuleService = req.scope.resolve(Modules.AUTH)

  const authData = {
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    protocol: req.protocol,
  } as AuthenticationInput

  const { success, error, authIdentity, existingEntityId } =
    await service.register(auth_provider, authData)

  const config = req.scope.resolve<ConfigModule>(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  // Answers the same way for new and existing identities, without a token. The
  // client logs in once the verification is confirmed.
  const hidingVerification = getVerificationHidingExistingIdentities(
    config,
    actor_type,
    auth_provider
  )
  if (hidingVerification && success && authIdentity) {
    const { verification } = await validateVerification(req.scope, {
      actor_type,
      auth_provider,
      auth_identity: authIdentity,
    })

    if (!verification?.verified_at) {
      await requestVerificationWorkflow(req.scope).run({
        input: {
          auth_identity_id: authIdentity.id,
          entity_id: authIdentity.provider_identities!.find(
            (identity) => identity.provider === auth_provider
          )!.entity_id,
          entity_type: hidingVerification.entity_type,
          code_provider: hidingVerification.code_provider ?? "token",
        },
      })
    }

    return res.status(200).json({ verification_required: true })
  }
  if (hidingVerification && existingEntityId) {
    await req.scope.resolve(Modules.EVENT_BUS).emit({
      name: AuthWorkflowEvents.REGISTRATION_WITH_EXISTING_IDENTITY,
      data: { entity_id: existingEntityId, actor_type, auth_provider },
    })

    return res.status(200).json({ verification_required: true })
  }

  if (success && authIdentity) {
    const { http } = config.projectConfig

    /*
      At registration time the auth identity doesn't have an actor attached to it, so we return the actorless token.
      The token can be used for few, auth-related operations, such as creating an actor, completing MFA,
      and completing other verifications.

      Once those are done the user either needs to use the returned token with an actor attached (eg. after verifying an MFA challenge)
      Or request a token refresh (such as after passing a verification)
     */
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
