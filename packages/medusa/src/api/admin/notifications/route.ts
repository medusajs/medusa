import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { AdminGetNotificationsParamsType } from "./validators"
import { refetchEntities } from "../../utils/refetch-entity"
import { HttpTypes } from "@medusajs/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetNotificationsParamsType>,
  res: MedusaResponse<HttpTypes.AdminNotificationListResponse>
) => {
  const { rows: notifications, metadata } = await refetchEntities(
    "notification",
    req.filterableFields,
    req.scope,
    req.remoteQueryConfig.fields,
    req.remoteQueryConfig.pagination
  )
  res.json({
    notifications,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
