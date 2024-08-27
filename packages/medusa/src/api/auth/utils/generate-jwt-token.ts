import { generateJwtToken } from "@medusajs/utils"

export function generateJwtTokenForAuthIdentity(
  { authIdentity, actorType },
  { secret, expiresIn }
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
