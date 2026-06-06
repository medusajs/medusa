import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import {
  AdminSetActiveViewConfigurationType,
  AdminGetActiveViewConfigurationParamsType,
} from "../validators"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"

/**
 * @since 2.10.3
 * @featureFlag view_configurations
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetActiveViewConfigurationParamsType>,
  res: MedusaResponse<
    HttpTypes.AdminViewConfigurationResponse & {
      is_default_active?: boolean
      default_type?: "system" | "code"
    }
  >
) => {
  const settingsService = req.scope.resolve(Modules.SETTINGS)

  const viewConfiguration = await settingsService.getActiveViewConfiguration(
    req.params.entity,
    req.auth_context.actor_id
  )

  if (!viewConfiguration) {
    // No active view set or explicitly cleared - return null
    res.json({
      view_configuration: null,
      is_default_active: true,
      default_type: "code",
    })
  } else {
    res.json({
      view_configuration: viewConfiguration,
      is_default_active: viewConfiguration.is_system_default,
      default_type: viewConfiguration.is_system_default ? "system" : undefined,
    })
  }
}

/**
 * @since 2.10.3
 * @featureFlag view_configurations
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<AdminSetActiveViewConfigurationType>,
  res: MedusaResponse<{ success: boolean }>
) => {
  const settingsService = req.scope.resolve(Modules.SETTINGS)

  if (req.body.view_configuration_id === null) {
    // Clear the active view configuration
    await settingsService.clearActiveViewConfiguration(
      req.params.entity,
      req.auth_context.actor_id
    )
  } else {
    // Set a specific view as active
    await settingsService.setActiveViewConfiguration(
      req.params.entity,
      req.auth_context.actor_id,
      req.body.view_configuration_id
    )
  }

  res.json({ success: true })
}
