import { linkSalesChannelsToStockLocationWorkflow } from "@medusajs/core-flows"
import { HttpTypes, LinkMethodRequest } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { refetchStockLocation } from "../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<LinkMethodRequest>,
  res: MedusaResponse<HttpTypes.AdminStockLocationResponse>
) => {
  const { id } = req.params
  const { add, remove } = req.validatedBody

  const workflow = linkSalesChannelsToStockLocationWorkflow(req.scope)
  await workflow.run({
    input: {
      id,
      add,
      remove,
    },
  })

  const stockLocation = await refetchStockLocation(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ stock_location: stockLocation })
}
