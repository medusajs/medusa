import { createLocationFulfillmentSetWorkflow } from "@medusajs/core-flows"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { AdminCreateStockLocationFulfillmentSetType } from "../../validators"
import { refetchStockLocation } from "../../helpers"

export const POST = async (
  req: MedusaRequest<AdminCreateStockLocationFulfillmentSetType>,
  res: MedusaResponse
) => {
  const { errors } = await createLocationFulfillmentSetWorkflow(req.scope).run({
    input: {
      location_id: req.params.id,
      fulfillment_set_data: {
        name: req.validatedBody.name,
        type: req.validatedBody.type,
      },
    },
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
