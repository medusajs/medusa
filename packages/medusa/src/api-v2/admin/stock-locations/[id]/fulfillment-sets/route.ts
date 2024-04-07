import { createLocationFulfillmentSetWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { z } from "zod"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { AdminCreateStockLocationFulfillmentSet } from "../../validators"

export const POST = async (
  req: MedusaRequest<z.infer<typeof AdminCreateStockLocationFulfillmentSet>>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

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

  const [stock_location] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "stock_locations",
      variables: {
        id: req.params.id,
      },
      fields: req.remoteQueryConfig.fields,
    })
  )

  res.status(200).json({ stock_location })
}
