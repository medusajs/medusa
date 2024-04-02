import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../../../types/routing"

import { AdminPostInventoryItemsItemLocationLevelsLevelReq } from "../../../validators"
import { deleteInventoryLevelsWorkflow } from "@medusajs/core-flows"
import { updateInventoryLevelsWorkflow } from "@medusajs/core-flows"

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id, location_id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const [{ id: levelId, reserved_quantity: reservedQuantity }] =
    await remoteQuery(
      remoteQueryObjectFromString({
        entryPoint: "inventory_level",
        variables: {
          inventory_item_id: id,
          location_id,
        },
        fields: ["id", "reserved_quantity"],
      })
    )

  if (reservedQuantity > 0) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      `Cannot remove Inventory Level ${id} at Location ${location_id} because there are reservations at location`
    )
  }

  const deleteInventoryLevelWorkflow = deleteInventoryLevelsWorkflow(req.scope)

  await deleteInventoryLevelWorkflow.run({
    input: {
      ids: [levelId],
    },
  })

  res.status(200).json({
    id: levelId,
    object: "inventory-level",
    deleted: true,
  })
}

export const POST = async (
  req: MedusaRequest<AdminPostInventoryItemsItemLocationLevelsLevelReq>,
  res: MedusaResponse
) => {
  const { id: inventory_item_id, location_id } = req.params
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { errors } = await updateInventoryLevelsWorkflow(req.scope).run({
    input: {
      updates: [{ inventory_item_id, location_id, ...req.validatedBody }],
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const [inventory_item] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "inventory",
      variables: {
        id: inventory_item_id,
      },
      fields: req.remoteQueryConfig.fields,
    })
  )

  res.status(200).json({
    inventory_item,
  })
}
