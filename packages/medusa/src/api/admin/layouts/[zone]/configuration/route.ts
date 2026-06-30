import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  clearLayoutConfigurationWorkflow,
  setLayoutConfigurationWorkflow,
} from "@medusajs/core-flows"
import { ISettingsModuleService } from "@medusajs/framework/types"

const getConfigurations = async (
  settingsService: ISettingsModuleService,
  zone: string,
  userId: string
): Promise<HttpTypes.AdminLayoutConfigurationResponse> => {
  const [personal] = await settingsService.listLayoutConfigurations(
    { zone, user_id: userId },
    { take: 1 }
  )

  const defaultConfiguration =
    await settingsService.getSystemDefaultLayoutConfiguration(zone)

  const storedScope = await settingsService.getActiveLayoutScope(zone, userId)

  // Resolve the scope to show: the user's persisted choice when still valid,
  // otherwise their personal view if they have one, else the default.
  let activeScope: HttpTypes.AdminLayoutScope
  if (storedScope === "personal" && personal) {
    activeScope = "personal"
  } else if (storedScope === "default") {
    activeScope = "default"
  } else {
    activeScope = personal ? "personal" : "default"
  }

  return {
    personal_configuration: personal ?? null,
    default_configuration: defaultConfiguration,
    active_scope: activeScope,
  }
}

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminLayoutConfigurationResponse>
) => {
  const settingsService = req.scope.resolve(Modules.SETTINGS)

  res.json(
    await getConfigurations(
      settingsService,
      req.params.zone,
      req.auth_context.actor_id
    )
  )
}

export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminSetLayoutConfiguration>,
  res: MedusaResponse<HttpTypes.AdminLayoutConfigurationResponse>
) => {
  await setLayoutConfigurationWorkflow(req.scope).run({
    input: {
      zone: req.params.zone,
      user_id: req.auth_context.actor_id,
      is_default: req.body.is_default,
      configuration: req.body.configuration,
    },
  })

  const settingsService = req.scope.resolve(Modules.SETTINGS)

  res.json(
    await getConfigurations(
      settingsService,
      req.params.zone,
      req.auth_context.actor_id
    )
  )
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<{ success: boolean }>
) => {
  await clearLayoutConfigurationWorkflow(req.scope).run({
    input: {
      zone: req.params.zone,
      user_id: req.auth_context.actor_id,
    },
  })

  res.json({ success: true })
}
