import {
  IInventoryService,
  InventoryItemDTO,
  WorkflowTypes,
} from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type Result = {
  tag: string
  createdInventoryItem?: InventoryItemDTO
  inventoryItemId: string
  requiredQuantity?: number
}[]

type InventoryItemAssociation = {
  /** The variant id that the inventory item should be associated with. */
  _associationTag: string
  creationInput?: InventoryItemDTO
  existingItem?: WorkflowTypes.ProductWorkflow.CreateVariantInventoryInputDTO
}

export async function createInventoryItems({
  container,
  data,
}: WorkflowArguments<{
  inventoryItems: InventoryItemAssociation[]
}>): Promise<Result | void> {
  const inventoryService: IInventoryService =
    container.resolve("inventoryService")

  if (!inventoryService) {
    const logger = container.resolve("logger")
    logger.warn(
      `Inventory service not found. You should install the @medusajs/inventory package to use inventory. The 'createInventoryItems' will be skipped.`
    )
    return void 0
  }

  const result = await Promise.all(
    data.inventoryItems.map(async (item) => {
      // Pass through existing inventory items.
      if (item.existingItem) {
        return {
          tag: item._associationTag,
          inventoryItemId: item.existingItem.inventory_item_id,
          requiredQuantity: item.existingItem.required_quantity,
        }
      }

      const inputData = item.creationInput!

      const inventoryItem = await inventoryService!.createInventoryItem({
        sku: inputData.sku!,
        origin_country: inputData.origin_country!,
        hs_code: inputData.hs_code!,
        mid_code: inputData.mid_code!,
        material: inputData.material!,
        weight: inputData.weight!,
        length: inputData.length!,
        height: inputData.height!,
        width: inputData.width!,
      })

      return {
        tag: item._associationTag,
        inventoryItem: inventoryItem,
        inventoryItemId: inventoryItem.id,
      }
    })
  )

  return result
}

createInventoryItems.aliases = {
  payload: "payload",
}
