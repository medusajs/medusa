import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  MedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"

import { AdminPostStockLocationsLocationSalesChannelBatchReq } from "../../../../validators"
import { addLocationsToSalesChannelWorkflow } from "@medusajs/core-flows"

export const POST = async (
  req: MedusaRequest<AdminPostStockLocationsLocationSalesChannelBatchReq>,
  res: MedusaResponse
) => {
  const workflowInput = {
    data: req.validatedBody.sales_channel_ids.map((id) => ({
      sales_channel_id: id,
      location_ids: [req.params.id],
    })),
  }

  const { errors } = await addLocationsToSalesChannelWorkflow(req.scope).run({
    input: workflowInput,
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "stock_locations",
    variables: { id: req.params.id },
    fields: req.remoteQueryConfig.fields,
  })

  const [stock_location] = await remoteQuery(queryObject)

  res.status(200).json({ stock_location })
}
