import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { AdminCloudHintListResponse } from "../../../../types"
import { fetchHints } from "../../../../utils/fetch-announcements"
import { getPluginOptions } from "../../../../utils/get-plugin-options"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<AdminCloudHintListResponse>
) => {
  try {
    const hints = await fetchHints(getPluginOptions(req.scope))
    res.json({ hints })
  } catch (error) {
    req.scope
      .resolve(ContainerRegistrationKeys.LOGGER)
      .warn(`Failed to fetch Medusa Cloud hints: ${error.message}`)

    res.json({ hints: [] })
  }
}
