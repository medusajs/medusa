import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { scopeFeedToActor } from "../helpers"
import { AdminGetNotificationParamsType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetNotificationParamsType>,
  res: MedusaResponse<HttpTypes.AdminNotificationResponse>
) => {
  const notification = await refetchEntity({
    entity: "notification",
    idOrFilter: scopeFeedToActor(req, { id: req.params.id }),
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  if (!notification) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Notification with id: ${req.params.id} was not found`
    )
  }

  res.status(200).json({ notification })
}
