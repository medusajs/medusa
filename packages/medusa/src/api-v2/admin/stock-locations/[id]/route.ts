import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

import { AdminPostStockLocationsLocationReq } from "../validators"
import { MedusaError } from "@medusajs/utils"
import { deleteStockLocationsWorkflow } from "@medusajs/core-flows"
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
