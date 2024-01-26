import {
  FilterableInventoryLevelProps,
  IInventoryService,
  InventoryItemDTO,
  InventoryLevelDTO,
} from "@medusajs/types"
import { promiseAll } from "@medusajs/utils"
import { LevelWithAvailability, ResponseInventoryItem } from "../../variants"

export const buildLevelsByInventoryItemId = (
  inventoryLevels: InventoryLevelDTO[],
  locationIds: string[]
) => {
  const filteredLevels = inventoryLevels.filter((level) => {
    return !locationIds.length || locationIds.includes(level.location_id)
  })

  return filteredLevels.reduce((acc, level) => {
    acc[level.inventory_item_id] = acc[level.inventory_item_id] ?? []
    acc[level.inventory_item_id].push(level)
    return acc
  }, {})
}

export const getLevelsByInventoryItemId = async (
  items: InventoryItemDTO[],
  locationIds: string[],
  inventoryService: IInventoryService
): Promise<Record<string, LevelWithAvailability[]>> => {
  const selector: FilterableInventoryLevelProps = {
    inventory_item_id: items.map((inventoryItem) => inventoryItem.id),
  }
  if (locationIds.length) {
    selector.location_id = locationIds
  }

  const [levels] = await inventoryService.listInventoryLevels(selector, {})

  const levelsWithAvailability: LevelWithAvailability[] = await promiseAll(
    levels.map(async (level) => {
      const availability = await inventoryService.retrieveAvailableQuantity(
        level.inventory_item_id,
        [level.location_id]
      )
      return {
        ...level,
        available_quantity: availability,
      }
    })
  )

  return buildLevelsByInventoryItemId(levelsWithAvailability, locationIds)
}

export const joinLevels = async (
  inventoryItems: InventoryItemDTO[],
  locationIds: string[],
  inventoryService: IInventoryService
): Promise<ResponseInventoryItem[]> => {
  const levelsByItemId = await getLevelsByInventoryItemId(
    inventoryItems,
    locationIds,
    inventoryService
  )

  return inventoryItems.map((inventoryItem) => {
    const levels = levelsByItemId[inventoryItem.id] ?? []
    const itemAvailability = levels.reduce(
      (acc, curr) => {
        return {
          reserved_quantity: acc.reserved_quantity + curr.reserved_quantity,
          stocked_quantity: acc.stocked_quantity + curr.stocked_quantity,
        }
      },
      { reserved_quantity: 0, stocked_quantity: 0 }
    )

    return {
      ...inventoryItem,
      ...itemAvailability,
      location_levels: levels,
    }
  })
}
