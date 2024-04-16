import {
  MedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"

import { AdminStockLocationsSalesChannelType } from "../../../../validators"
import { removeLocationsFromSalesChannelWorkflow } from "@medusajs/core-flows"
import { refetchStockLocation } from "../../../../helpers"

export const POST = async (
  req: MedusaRequest<AdminStockLocationsSalesChannelType>,
  res: MedusaResponse
) => {
  const workflowInput = {
    data: req.validatedBody.sales_channel_ids.map((id) => ({
      sales_channel_id: id,
      location_ids: [req.params.id],
    })),
  }

  const { errors } = await removeLocationsFromSalesChannelWorkflow(
    req.scope
  ).run({
    input: workflowInput,
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const stockLocation = await refetchStockLocation(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ stock_location: stockLocation })
}
