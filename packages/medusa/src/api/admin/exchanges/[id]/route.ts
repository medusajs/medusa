import { AdminExchangeResponse } from "@medusajs/types"
import { MedusaError } from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { refetchEntity } from "../../../utils/refetch-entity"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<AdminExchangeResponse>
) => {
  const exchange = await refetchEntity(
    "order_exchange",
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  if (!exchange) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Exchange with id: ${req.params.id} was not found`
    )
  }

  res.status(200).json({ exchange })
}
