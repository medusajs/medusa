import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createInventoryItemsStep } from "../steps"

import { InventoryNext } from "@medusajs/types"
import { createInventoryLevelsWorkflow } from "./create-inventory-levels"

type LocationLevelWithoutInventory = Omit<
  InventoryNext.CreateInventoryLevelInput,
  "inventory_item_id"
>
interface WorkflowInput {
  items: (InventoryNext.CreateInventoryItemInput & {
    location_levels?: LocationLevelWithoutInventory[]
  })[]
}

const buildLocationLevelMapAndItemData = (data: WorkflowInput) => {
  data.items = data.items ?? []
  const inventoryItems: InventoryNext.CreateInventoryItemInput[] = []
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
  items: InventoryNext.InventoryItemDTO[]
}) => {
  const inventoryLevels: InventoryNext.CreateInventoryLevelInput[] = []
  let index = 0

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
