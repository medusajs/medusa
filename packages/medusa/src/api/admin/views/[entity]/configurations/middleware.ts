import {
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { SettingsTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  singularize,
  toSnakeCase,
} from "@medusajs/framework/utils"
import ViewConfigurationsFeatureFlag from "../../../../../feature-flags/view-configurations"
import { filterReadableEntities } from "../../../utils/filter-readable-entities"

export const ensureViewConfigurationsEnabled = async (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  const flagRouter = req.scope.resolve(
    ContainerRegistrationKeys.FEATURE_FLAG_ROUTER
  ) as any

  if (!flagRouter.isFeatureEnabled(ViewConfigurationsFeatureFlag.key)) {
    res.status(404).json({
      type: "not_found",
      message: "Route not found",
    })
    return
  }

  next()
}

/**
 * Resolves a views `:entity` param (e.g. `orders`, `Order`, `product-variants`)
 * to its snake_case RBAC resource name, matching the entity the same way the
 * Settings Module's entity discovery does: by name, then by plural name, then
 * by its normalized singular form.
 */
export const resolveViewEntityResource = async (
  req: MedusaRequest,
  entity: string
): Promise<string> => {
  const settingsService =
    req.scope.resolve<SettingsTypes.ISettingsModuleService>(Modules.SETTINGS, {
      allowUnregistered: true,
    })

  const entities = settingsService?.isEntityDiscoveryInitialized()
    ? await settingsService.listDiscoverableEntities()
    : []

  const lowerEntity = entity.toLowerCase()
  const match =
    entities.find(({ name }) => name.toLowerCase() === lowerEntity) ??
    entities.find(({ pluralName }) => pluralName.toLowerCase() === lowerEntity)

  return match
    ? toSnakeCase(match.name)
    : singularize(toSnakeCase(entity)).toLowerCase()
}

/**
 * Guards the views routes, whose resource is the `:entity` route param: the
 * actor must be able to read the entity the view describes. Responds with a
 * 403 otherwise. It is a no-op when RBAC is disabled.
 */
export const ensureViewEntityReadable = async (
  req: AuthenticatedMedusaRequest,
  _: MedusaResponse,
  next: MedusaNextFunction
) => {
  if (!MedusaModule.isInstalled(Modules.RBAC)) {
    return next()
  }

  const resource = await resolveViewEntityResource(req, req.params.entity)
  const [readable] = await filterReadableEntities(req, [resource])

  if (!readable) {
    throw new MedusaError(
      MedusaError.Types.FORBIDDEN,
      `Insufficient permissions. Required policies: ${resource}:read`
    )
  }

  return next()
}

export const SYSTEM_DEFAULT_VIEW_CONFIGURATION_MESSAGE =
  "Only super admins can manage system default view configurations"

/**
 * Whether the view configuration targeted by `req.params.id` is a system
 * default, which applies to every user. A missing configuration is not one;
 * the route handler reports the 404.
 */
export const isSystemDefaultViewConfiguration = async (
  req: AuthenticatedMedusaRequest
): Promise<boolean> => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [existing],
  } = await query.graph({
    entity: "view_configuration",
    fields: ["is_system_default"],
    filters: { id: req.params.id },
  })

  return !!existing?.is_system_default
}
