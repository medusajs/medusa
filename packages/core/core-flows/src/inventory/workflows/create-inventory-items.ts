import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { createInventoryItemsStep } from "../steps"

import type { InventoryTypes } from "@medusajs/framework/types"
import { InventoryItemWorkflowEvents } from "@medusajs/framework/utils"
import { emitEventStep } from "../../common"
import { createInventoryLevelsWorkflow } from "./create-inventory-levels"

/**
 * The inventory level to create.
 */
type LocationLevelWithoutInventory = Omit<
  InventoryTypes.CreateInventoryLevelInput,
  "inventory_item_id"
>
/**
 * The data to create the inventory items.
 */
export interface CreateInventoryItemsWorkflowInput {
  /**
   * The items to create.
   */
  items: (InventoryTypes.CreateInventoryItemInput & {
    /**
     * The inventory levels of the inventory item.
     */
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
 * This workflow creates one or more inventory items. It's used by the
 * [Create Inventory Item Admin API Route](https://docs.medusajs.com/api/admin/inventory-items/create-inventory-item).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to create inventory items in your custom flows.
 *
 * @example
 * const { result } = await createInventoryItemsWorkflow(container)
 * .run({
 *   input: {
 *     items: [
 *       {
 *         sku: "shirt",
 *         location_levels: [
 *           {
 *             location_id: "sloc_123",
 *           }
 *         ]
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Create one or more inventory items.
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

    const itemIdEvents = transform({ items }, ({ items }) => {
      return items.map((item) => ({ id: item.id }))
    })

    emitEventStep({
      eventName: InventoryItemWorkflowEvents.CREATED,
      data: itemIdEvents,
    })

    return new WorkflowResponse(items)
  }
)
