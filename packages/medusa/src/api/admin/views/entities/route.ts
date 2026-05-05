import { HttpTypes, SettingsTypes } from "@medusajs/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

/**
 * List all available entities that can be used for view configurations.
 * Entities are discovered from joiner configs (GraphQL schema).
 *
 * @since 2.10.3
 * @featureFlag view_configurations
 */
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminEntityListResponse>
) => {
  const settingsService =
    req.scope.resolve<SettingsTypes.ISettingsModuleService>(Modules.SETTINGS)

  const entities = settingsService.listDiscoverableEntities()

  entities.sort((a, b) => a.name.localeCompare(b.name))

  return res.json({
    entities,
  })
}
