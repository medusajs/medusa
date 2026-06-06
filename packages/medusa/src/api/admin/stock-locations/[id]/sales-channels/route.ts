import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"

import { linkSalesChannelsToStockLocationWorkflow } from "@zjedene-medusa/core-flows"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import { refetchStockLocation } from "../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminBatchLink,
    HttpTypes.SelectParams
  >,
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
    req.queryConfig.fields
  )
  res.status(200).json({ stock_location: stockLocation })
}
