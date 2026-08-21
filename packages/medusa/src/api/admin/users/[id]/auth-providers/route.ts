import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * @since 2.19.1
 */
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminUserAuthProvidersResponse>
) => {
  const { id } = req.params

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: authIdentities } = await query.graph({
    entity: "auth_identity",
    fields: ["provider_identities.provider"],
    filters: {
      app_metadata: {
        user_id: id,
      },
    },
  })

  const providers = authIdentities.flatMap(
    (authIdentity) =>
      authIdentity.provider_identities?.map(
        (providerIdentity) => providerIdentity.provider
      ) ?? []
  )

  res.status(200).json({ providers })
}
