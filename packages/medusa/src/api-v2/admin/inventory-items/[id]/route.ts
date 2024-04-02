import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import {
  deleteInventoryItemWorkflow,
  updateInventoryItemsWorkflow,
} from "@medusajs/core-flows"

import { AdminPostInventoryItemsInventoryItemReq } from "../validators"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "inventory",
    variables: {
      filters: { id },
      skip: 0,
      take: 1,
    },

    fields: req.retrieveConfig.select as string[],
  })

  const { rows } = await remoteQuery(query)

  const [inventory_item] = rows

  if (!inventory_item) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Inventory item with id: ${id} was not found`
    )
  }

  res.status(200).json({
    inventory_item,
  })
}

// Update inventory item
export const POST = async (
  req: MedusaRequest<AdminPostInventoryItemsInventoryItemReq>,
  res: MedusaResponse
) => {
  const { id } = req.params

  await updateInventoryItemsWorkflow(req.scope).run({
    input: {
      updates: [{ id, ...req.validatedBody }],
    },
  })

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const [inventory_item] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "inventory",
      variables: {
        id,
      },
      fields: req.retrieveConfig.select as string[],
    })
  )

  res.status(200).json({
    inventory_item,
  })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const id = req.params.id
  const deleteInventoryItems = deleteInventoryItemWorkflow(req.scope)

  const { errors } = await deleteInventoryItems.run({
    input: [id],
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "inventory_item",
    deleted: true,
  })
}
