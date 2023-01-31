import { IInventoryService } from "../../../../../interfaces"
import {
  InventoryItemDTO,
  InventoryLevelDTO,
} from "../../../../../types/inventory"

type LevelWithAvailability = InventoryLevelDTO & {
  available_quantity: number
}

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
) => {
  const [levels] = await inventoryService.listInventoryLevels({
    inventory_item_id: items.map((inventoryItem) => inventoryItem.id),
  })

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
) => {
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
