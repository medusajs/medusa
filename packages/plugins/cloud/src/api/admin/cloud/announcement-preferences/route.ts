import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { AdminCloudAnnouncementPreferencesResponse } from "../../../../types"
import { updateAnnouncementPreferencesWorkflow } from "../../../../workflows/update-announcement-preferences"
import { AdminUpdateCloudAnnouncementPreferencesType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<AdminCloudAnnouncementPreferencesResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const {
    data: [preferences],
  } = await query.graph({
    entity: "cloud_announcement_preference",
    fields: ["security", "feature", "cloud"],
    pagination: { take: 1 },
  })

  res.json({
    announcement_preferences: {
      security: preferences?.security ?? true,
      feature: preferences?.feature ?? true,
      cloud: preferences?.cloud ?? true,
    },
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateCloudAnnouncementPreferencesType>,
  res: MedusaResponse<AdminCloudAnnouncementPreferencesResponse>
) => {
  const { result } = await updateAnnouncementPreferencesWorkflow(req.scope).run(
    {
      input: { preferences: req.validatedBody },
    }
  )

  res.json({ announcement_preferences: result })
}
