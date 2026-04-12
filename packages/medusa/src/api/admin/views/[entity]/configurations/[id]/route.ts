import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { AdminUpdateViewConfigurationType } from "../validators"
import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { updateViewConfigurationWorkflow } from "@medusajs/core-flows"

/**
 * @since 2.10.3
 * @featureFlag view_configurations
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminGetViewConfigurationParams>,
  res: MedusaResponse<HttpTypes.AdminViewConfigurationResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [viewConfiguration],
  } = await query.graph({
    entity: "view_configuration",
    fields: req.queryConfig.fields,
    filters: { id: req.params.id },
  })

  if (!viewConfiguration) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `View configuration with id: ${req.params.id} not found`
    )
  }

  if (
    viewConfiguration.user_id &&
    viewConfiguration.user_id !== req.auth_context.actor_id &&
    !req.auth_context.app_metadata?.admin
  ) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "You don't have access to this view configuration"
    )
  }

  res.json({ view_configuration: viewConfiguration })
}

/**
 * @since 2.10.3
 * @featureFlag view_configurations
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateViewConfigurationType>,
  res: MedusaResponse<HttpTypes.AdminViewConfigurationResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  // Fetch existing for permission check
  const {
    data: [existing],
  } = await query.graph({
    entity: "view_configuration",
    fields: ["id", "user_id", "is_system_default"],
    filters: { id: req.params.id },
  })

  if (!existing) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `View configuration with id: ${req.params.id} not found`
    )
  }

  if (existing.user_id && existing.user_id !== req.auth_context.actor_id) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "You can only update your own view configurations"
    )
  }

  const input = {
    id: req.params.id,
    ...req.validatedBody,
  }

  await updateViewConfigurationWorkflow(req.scope).run({
    input,
  })

  const {
    data: [viewConfiguration],
  } = await query.graph({
    entity: "view_configuration",
    fields: req.queryConfig.fields,
    filters: { id: req.params.id },
  })

  res.json({ view_configuration: viewConfiguration })
}

/**
 * @since 2.10.3
 * @featureFlag view_configurations
 */
export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminViewConfigurationDeleteResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const settingsService = req.scope.resolve(Modules.SETTINGS)

  // Fetch existing to check permissions
  const {
    data: [existing],
  } = await query.graph({
    entity: "view_configuration",
    fields: ["id", "user_id", "is_system_default", "entity", "name"],
    filters: { id: req.params.id },
  })

  if (!existing) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `View configuration with id: ${req.params.id} not found`
    )
  }

  if (existing.user_id && existing.user_id !== req.auth_context.actor_id) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "You can only delete your own view configurations"
    )
  }

  await settingsService.deleteViewConfigurations(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "view_configuration",
    deleted: true,
  })
}
