import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

import { MedusaError } from "@medusajs/utils"
import { deleteStockLocationsWorkflow } from "@medusajs/core-flows"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const [stock_location] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "stock_locations",
      variables: {
        id,
      },
      fields: req.remoteQueryConfig.fields,
    })
  )

  if (!stock_location) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Stock location with id: ${id} was not found`
    )
  }

  res.status(200).json({ stock_location })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params

  const { errors } = await deleteStockLocationsWorkflow(req.scope).run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "stock_location",
    deleted: true,
  })
}
