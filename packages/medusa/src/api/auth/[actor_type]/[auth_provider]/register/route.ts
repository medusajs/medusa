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

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { actor_type, auth_provider } = req.params

  const service: IAuthModuleService = req.scope.resolve(Modules.AUTH)

  const authData = {
    actor_type,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    protocol: req.protocol,
  } as AuthenticationInput

  const { success, error, authIdentity } = await service.register(
    auth_provider,
    authData
  )

  if (success && authIdentity) {
    const { http } = req.scope.resolve<ConfigModule>(
      ContainerRegistrationKeys.CONFIG_MODULE
    ).projectConfig

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
