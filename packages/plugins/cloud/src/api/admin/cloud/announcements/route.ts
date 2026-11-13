import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { AdminCloudAnnouncementListResponse } from "../../../../types"
import { CLOUD_MODULE } from "../../../../modules/cloud"
import CloudModuleService from "../../../../modules/cloud/service"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<AdminCloudAnnouncementListResponse>
) => {
  try {
    const announcements = await req.scope
      .resolve<CloudModuleService>(CLOUD_MODULE)
      .listAnnouncements()
    res.json({ announcements })
  } catch (error) {
    req.scope
      .resolve(ContainerRegistrationKeys.LOGGER)
      .warn(`Failed to fetch Medusa Cloud announcements: ${error.message}`)

    res.json({ announcements: [] })
  }
}
