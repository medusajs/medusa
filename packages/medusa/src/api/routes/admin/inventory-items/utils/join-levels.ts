import {
  FilterableInventoryLevelProps,
  IInventoryService,
  InventoryItemDTO,
  InventoryLevelDTO,
} from "@medusajs/types"
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

  const levelsWithAvailability: LevelWithAvailability[] = await Promise.all(
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

  return inventoryItems.map((inventoryItem) => ({
    ...inventoryItem,
    location_levels: levelsByItemId[inventoryItem.id] || [],
  }))
}
