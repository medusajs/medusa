import { createServiceZonesWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { refetchFulfillmentSet } from "../../helpers"
import { AdminCreateFulfillmentSetServiceZonesType } from "../../validators"

export const POST = async (
  req: MedusaRequest<AdminCreateFulfillmentSetServiceZonesType>,
  res: MedusaResponse<HttpTypes.AdminFulfillmentSetResponse>
) => {
  const workflowInput = {
    data: [
      {
        fulfillment_set_id: req.params.id,
        name: req.validatedBody.name,
        geo_zones: req.validatedBody.geo_zones,
      },
    ],
  }

  await createServiceZonesWorkflow(req.scope).run({
    input: workflowInput,
  })

  const fulfillmentSet = await refetchFulfillmentSet(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ fulfillment_set: fulfillmentSet })
}
