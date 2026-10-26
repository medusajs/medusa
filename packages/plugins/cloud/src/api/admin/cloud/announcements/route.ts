import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  AdminCloudAnnouncementListResponse,
  CloudPluginOptions,
} from "../../../../types"
import { fetchAnnouncements } from "../../../../utils/fetch-announcements"

const PLUGIN_NAME = "@medusajs/cloud"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<AdminCloudAnnouncementListResponse>
) => {
  const { plugins } = req.scope.resolve(ContainerRegistrationKeys.CONFIG_MODULE)
  const plugin = plugins.find(
    (p) => typeof p !== "string" && p.resolve === PLUGIN_NAME
  ) as { options?: CloudPluginOptions } | undefined
  const options = plugin?.options ?? {}

  try {
    const announcements = await fetchAnnouncements(options)
    res.json({ announcements })
  } catch (error) {
    req.scope
      .resolve(ContainerRegistrationKeys.LOGGER)
      .warn(`Failed to fetch Medusa Cloud announcements: ${error.message}`)

    res.json({ announcements: [] })
  }
}
