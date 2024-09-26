import { MedusaError } from "@medusajs/framework/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { refetchOrder } from "../helpers"
import { defaultAdminOrderFields } from "../query-config"
import { HttpTypes } from "@medusajs/types"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse<HttpTypes.AdminDraftOrderResponse>
) => {
  const draftOrder = await refetchOrder(
    req.params.id,
    req.scope,
    defaultAdminOrderFields
  )

  if (!draftOrder) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Draft order with id: ${req.params.id} was not found`
    )
  }

  res.status(200).json({ draft_order: draftOrder })
}
