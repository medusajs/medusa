import { IInventoryService } from "../../../../../interfaces"
import {
  InventoryItemDTO,
  InventoryLevelDTO,
} from "../../../../../types/inventory"

type LevelWithAvailability = InventoryLevelDTO & {
  available_quantity: number
}

export const buildLevelsByInventoryItemId = (
  inventoryLevels: (LevelWithAvailability | InventoryLevelDTO)[],
  locationIds: string[]
) => {
  return inventoryLevels.reduce((acc, level) => {
    if (locationIds.length) {
      if (!locationIds.includes(level.location_id)) {
        return acc
      }
    }

    if (level.inventory_item_id in acc) {
      acc[level.inventory_item_id].push(level)
    } else {
      acc[level.inventory_item_id] = [level]
    }

    return acc
  }, {})
}

export const getLevelsByInventoryItemId = async (
  items: InventoryItemDTO[],
  locationIds: string[],
  inventoryService: IInventoryService
) => {
  const [levels] = await inventoryService.listInventoryLevels({
    inventory_item_id: items.map((i) => i.id),
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

  const responseItems = inventoryItems.map((i) => {
    const responseItem: ResponseInventoryItem = { ...i }
    responseItem.location_levels = levelsByItemId[i.id] || []
    return responseItem
  })
  return responseItems
}

type ResponseInventoryItem = Partial<InventoryItemDTO> & {
  location_levels?: InventoryLevelDTO[]
}
