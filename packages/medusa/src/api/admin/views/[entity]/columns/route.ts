import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes, SettingsTypes } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"

/**
 * Get available columns for an entity.
 *
 * @since 2.10.3
 * @featureFlag view_configurations
 */
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminViewsEntityColumnsResponse>
) => {
  const entity = req.params.entity

  const settingsService =
    req.scope.resolve<SettingsTypes.ISettingsModuleService>(Modules.SETTINGS)

  if (!settingsService.isEntityDiscoveryInitialized()) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Entity discovery has not been initialized. Please ensure the application has fully started."
    )
  }

  if (!settingsService.hasEntity(entity)) {
    const availableEntities = settingsService.listDiscoverableEntities()
    const entityNames = availableEntities.map((e) => e.pluralName).slice(0, 10)

    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Unsupported entity: ${entity}. Available entities include: ${entityNames.join(
        ", "
      )}${availableEntities.length > 10 ? "..." : ""}`
    )
  }

  const columns = await settingsService.generateEntityColumns(entity)

  if (!columns) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to generate columns for entity: ${entity}`
    )
  }

  return res.json({
    columns,
  })
}
