import { MedusaError } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import {
  deleteInventoryItemWorkflow,
  updateInventoryItemsWorkflow,
} from "@medusajs/core-flows"
import {
  AdminGetInventoryItemParamsType,
  AdminUpdateInventoryItemType,
} from "../validators"
import { refetchInventoryItem } from "../helpers"

export const GET = async (
  req: MedusaRequest<AdminGetInventoryItemParamsType>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const inventoryItem = await refetchInventoryItem(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  if (!inventoryItem) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Inventory item with id: ${id} was not found`
    )
  }

  res.status(200).json({
    inventory_item: inventoryItem,
  })
}

// Update inventory item
export const POST = async (
  req: MedusaRequest<AdminUpdateInventoryItemType>,
  res: MedusaResponse
) => {
  const { id } = req.params

  await updateInventoryItemsWorkflow(req.scope).run({
    input: {
      updates: [{ id, ...req.validatedBody }],
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

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const id = req.params.id
  const deleteInventoryItems = deleteInventoryItemWorkflow(req.scope)

  await deleteInventoryItems.run({
    input: [id],
  })

  res.status(200).json({
    id,
    object: "inventory_item",
    deleted: true,
  })
}
