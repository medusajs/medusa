import {
  AuthenticatedMedusaRequest,
  HttpTypes,
  MedusaResponse,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<undefined, HttpTypes.AdminRbacScopesParams>,
  res: MedusaResponse<HttpTypes.AdminRbacScopesResponse>
) => {
  const { actor_type, grantee_type } = req.validatedQuery

  const rbacModuleService = req.scope.resolve(Modules.RBAC)

  const authzContextConfig =
    await rbacModuleService.retrieveActorAutzContextConfig(actor_type)

  const scopeConfigs =
    authzContextConfig?.grantees.find(
      (grantee) => grantee.entity === grantee_type
    )?.scope_configs ?? []

  return res.status(200).json({
    scopes: scopeConfigs.map((scopeConfig) => ({
      type: scopeConfig.type,
    })),
  })
}
