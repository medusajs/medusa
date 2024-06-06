import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createInventoryItemsStep } from "../steps"

import { InventoryNext } from "@medusajs/types"
import { createInventoryLevelsWorkflow } from "./create-inventory-levels"

interface WorkflowInput {
  items: (InventoryNext.CreateInventoryItemInput & {
    location_levels?: InventoryNext.CreateInventoryLevelInput[]
  })[]
}

const buildLocationLevelMapAndItemData = (data: WorkflowInput) => {
  const inventoryItems: InventoryNext.CreateInventoryItemInput[] = []
  // Keep an index to location levels mapping to inject the created inventory item
  // id into the location levels workflow input
  const locationLevelMap: Record<
    number,
    InventoryNext.CreateInventoryLevelInput[]
  > = {}
  let index = 0

  for (const { location_levels, ...inventoryItem } of data.items || []) {
    locationLevelMap[index] = location_levels?.length ? location_levels : []
    inventoryItems.push(inventoryItem)

    index += 1
  }

  return {
    locationLevelMap,
    inventoryItems,
  }
}

const buildInventoryLevelsInput = (data: {
  locationLevelMap: Record<number, InventoryNext.CreateInventoryLevelInput[]>
  items: InventoryNext.InventoryItemDTO[]
}) => {
  const inventoryLevels: InventoryNext.CreateInventoryLevelInput[] = []
  let index = 0

  // The order of the input is critical to accurately create location levels for
  // the right inventory item
  for (const item of data.items || []) {
    const locationLevels = data.locationLevelMap[index] || []

    for (const locationLevel of locationLevels) {
      inventoryLevels.push({
        ...locationLevel,
        inventory_item_id: item.id,
      })
    }

    index += 1
  }

  return {
    input: {
      inventory_levels: inventoryLevels,
    },
  }
}

export const createInventoryItemsWorkflowId = "create-inventory-items-workflow"
export const createInventoryItemsWorkflow = createWorkflow(
  createInventoryItemsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
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

    return items
  }
)
