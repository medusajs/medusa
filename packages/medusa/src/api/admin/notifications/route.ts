import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { AdminGetNotificationsParamsType } from "./validators"
import { refetchEntities } from "../../utils/refetch-entity"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetNotificationsParamsType>,
  res: MedusaResponse
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
