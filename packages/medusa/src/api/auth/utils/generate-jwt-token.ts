import { AuthIdentityDTO } from "@medusajs/framework/types"
import { generateJwtToken } from "@medusajs/framework/utils"

export function generateJwtTokenForAuthIdentity(
  {
    authIdentity,
    actorType,
  }: { authIdentity: AuthIdentityDTO; actorType: string },
  {
    secret,
    expiresIn,
  }: { secret: string | undefined; expiresIn: string | undefined }
) {
  const entityIdKey = `${actorType}_id`
  const entityId = authIdentity?.app_metadata?.[entityIdKey] as
    | string
    | undefined

  return generateJwtToken(
    {
      actor_id: entityId ?? "",
      actor_type: actorType,
      auth_identity_id: authIdentity?.id ?? "",
      app_metadata: {
        [entityIdKey]: entityId,
      },
    },
    {
      secret,
      expiresIn,
    }
  )
}
