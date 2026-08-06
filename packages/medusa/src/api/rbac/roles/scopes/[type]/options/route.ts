import {
  AuthenticatedMedusaRequest,
  HttpTypes,
  MedusaResponse,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  pickValueFromObject,
} from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<
    undefined,
    HttpTypes.AdminRbacScopeOptionsParams
  >,
  res: MedusaResponse<HttpTypes.AdminRbacScopeOptionsResponse>
) => {
  const { actor_type, actor_id, grantee_type } = req.validatedQuery
  const { type: scopeType } = req.params

  const rbacModuleService = req.scope.resolve(Modules.RBAC)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const authzContextConfig =
    await rbacModuleService.retrieveActorAutzContextConfig(actor_type)

  const scopeConfig = (
    authzContextConfig?.grantees.find(
      (grantee) => grantee.entity === grantee_type
    )?.scope_configs ?? []
  ).find((scopeConfig) => scopeConfig.type === scopeType)

  if (!scopeConfig) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Scope config for ${scopeType} not found for the given parameters`
    )
  }

  const {
    data: [actor],
  } = await query.graph({
    entity: actor_type,
    fields: [`${scopeConfig.path}.*`],
    filters: {
      id: actor_id,
    },
  })

  const resolvedScopeFromActor = pickValueFromObject(
    scopeConfig.path,
    actor ?? {}
  )

  if (!resolvedScopeFromActor) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Scope not found for the given parameters`
    )
  }

  const normalizedScope = Array.isArray(resolvedScopeFromActor)
    ? resolvedScopeFromActor
    : [resolvedScopeFromActor]

  const options = normalizedScope.map((scope) => {
    const displayField = scopeConfig.display_field
      ? scope[scopeConfig.display_field]
      : scope.name ?? scope.title

    const idField = scope[scopeConfig.id_field ?? "id"]

    return {
      id: idField,
      label: displayField ?? idField,
    }
  })

  return res.status(200).json({
    options,
  })
}
