import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../../../types/routing"

import {
  deleteInventoryLevelsWorkflow,
  updateInventoryLevelsWorkflow,
} from "@medusajs/core-flows"
import { refetchInventoryItem } from "../../../helpers"
import { AdminUpdateInventoryLocationLevelType } from "../../../validators"

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id, location_id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  // TODO: We probably want to move this logic to the workflow
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

  const inventoryItem = await refetchInventoryItem(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({
    id: levelId,
    object: "inventory-level",
    deleted: true,
    parent: inventoryItem,
  })
}

export const POST = async (
  req: MedusaRequest<AdminUpdateInventoryLocationLevelType>,
  res: MedusaResponse
) => {
  const { id, location_id } = req.params
  await updateInventoryLevelsWorkflow(req.scope).run({
    input: {
      updates: [{ ...req.validatedBody, inventory_item_id: id, location_id }],
    },
  })

  const inventoryItem = await refetchInventoryItem(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({
    inventory_item: inventoryItem,
  })
}
