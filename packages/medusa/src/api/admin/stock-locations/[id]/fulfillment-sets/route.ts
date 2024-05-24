import { createLocationFulfillmentSetWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { refetchStockLocation } from "../../helpers"
import { AdminCreateStockLocationFulfillmentSetType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateStockLocationFulfillmentSetType>,
  res: MedusaResponse
) => {
  await createLocationFulfillmentSetWorkflow(req.scope).run({
    input: {
      location_id: req.params.id,
      fulfillment_set_data: {
        name: req.validatedBody.name,
        type: req.validatedBody.type,
      },
    },
  })

  const stockLocation = await refetchStockLocation(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ stock_location: stockLocation })
}
