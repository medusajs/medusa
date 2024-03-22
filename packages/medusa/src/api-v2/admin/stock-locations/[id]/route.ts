import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

import { AdminPostStockLocationsLocationReq } from "../validators"
import { updateStockLocationsWorkflow } from "@medusajs/core-flows"

export const POST = async (
  req: MedusaRequest<AdminPostStockLocationsLocationReq>,
  res: MedusaResponse
) => {
  const { id } = req.params

  await updateStockLocationsWorkflow(req.scope).run({
    input: {
      updates: [{ id, ...req.validatedBody }],
    },
  })

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const [stock_location] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "stock_locations",
      variables: {
        id,
      },
      fields: req.retrieveConfig.select as string[],
    })
  )

  res.status(200).json({
    stock_location,
  })
}
