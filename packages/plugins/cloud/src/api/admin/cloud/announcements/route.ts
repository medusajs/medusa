import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { AdminCloudAnnouncementListResponse } from "../../../../types"
import { fetchAnnouncements } from "../../../../utils/fetch-announcements"
import { getPluginOptions } from "../../../../utils/get-plugin-options"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<AdminCloudAnnouncementListResponse>
) => {
  try {
    const announcements = await fetchAnnouncements(getPluginOptions(req.scope))
    res.json({ announcements })
  } catch (error) {
    req.scope
      .resolve(ContainerRegistrationKeys.LOGGER)
      .warn(`Failed to fetch Medusa Cloud announcements: ${error.message}`)

    res.json({ announcements: [] })
  }
}
