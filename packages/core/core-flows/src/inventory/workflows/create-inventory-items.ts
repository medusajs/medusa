import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { createInventoryItemsStep } from "../steps"

import { InventoryTypes } from "@medusajs/framework/types"
import { createInventoryLevelsWorkflow } from "./create-inventory-levels"

type LocationLevelWithoutInventory = Omit<
  InventoryTypes.CreateInventoryLevelInput,
  "inventory_item_id"
>
export interface CreateInventoryItemsWorkflowInput {
  items: (InventoryTypes.CreateInventoryItemInput & {
    location_levels?: LocationLevelWithoutInventory[]
  })[]
}

const buildLocationLevelMapAndItemData = (
  data: CreateInventoryItemsWorkflowInput
) => {
  data.items = data.items ?? []
  const inventoryItems: InventoryTypes.CreateInventoryItemInput[] = []
  // Keep an index to location levels mapping to inject the created inventory item
  // id into the location levels workflow input
  const locationLevelMap: Record<number, LocationLevelWithoutInventory[]> = {}

  data.items.forEach(({ location_levels, ...inventoryItem }, index) => {
    locationLevelMap[index] = location_levels?.length ? location_levels : []

    inventoryItems.push(inventoryItem)
  })

  return {
    locationLevelMap,
    inventoryItems,
  }
}

const buildInventoryLevelsInput = (data: {
  locationLevelMap: Record<number, LocationLevelWithoutInventory[]>
  items: InventoryTypes.InventoryItemDTO[]
}) => {
  const inventoryLevels: InventoryTypes.CreateInventoryLevelInput[] = []

  // The order of the input is critical to accurately create location levels for
  // the right inventory item
  data.items.forEach((item, index) => {
    const locationLevels = data.locationLevelMap[index] || []

    locationLevels.forEach((locationLevel) =>
      inventoryLevels.push({
        ...locationLevel,
        inventory_item_id: item.id,
      })
    )
  })

  return {
    input: {
      inventory_levels: inventoryLevels,
    },
  }
}

export const createInventoryItemsWorkflowId = "create-inventory-items-workflow"
/**
 * This workflow creates one or more inventory items.
 */
export const createInventoryItemsWorkflow = createWorkflow(
  createInventoryItemsWorkflowId,
  (input: WorkflowData<CreateInventoryItemsWorkflowInput>) => {
    const { locationLevelMap, inventoryItems } = transform(
      input,
      buildLocationLevelMapAndItemData
    )
    const items = createInventoryItemsStep(inventoryItems)

    const inventoryLevelsInput = transform(
      { items, locationLevelMap },
      buildInventoryLevelsInput
    )

    createInventoryLevelsWorkflow.runAsStep(inventoryLevelsInput)

    return new WorkflowResponse(items)
  }
)
