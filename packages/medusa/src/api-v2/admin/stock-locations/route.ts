import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"

import { AdminPostStockLocationsReq } from "./validators"
import { createStockLocationsWorkflow } from "@medusajs/core-flows"

// Create stock location
export const POST = async (
  req: MedusaRequest<AdminPostStockLocationsReq>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { result } = await createStockLocationsWorkflow(req.scope).run({
    input: { locations: [req.validatedBody] },
  })

  const [stock_location] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "stock_locations",
      variables: {
        id: result[0].id,
      },
      fields: req.remoteQueryConfig.fields,
    })
  )

  res.status(200).json({ stock_location })
}
