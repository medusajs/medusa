import { IInventoryService } from "../../../../../interfaces"
import {
  InventoryItemDTO,
  InventoryLevelDTO,
} from "../../../../../types/inventory"

type LevelWithAvailability = InventoryLevelDTO & {
  available_quantity: number
}

export const buildLevelsByItemId = (
  levels: (LevelWithAvailability | InventoryLevelDTO)[],
  locationIds: string[]
) => {
  return levels.reduce((acc, level) => {
    if (locationIds.length) {
      if (!locationIds.includes(level.location_id)) {
        return acc
      }
    }

    if (level.item_id in acc) {
      acc[level.item_id].push(level)
    } else {
      acc[level.item_id] = [level]
    }

    return acc
  }, {})
}

export const getLevelsByItemId = async (
  items: InventoryItemDTO[],
  locationIds: string[],
  inventoryService: IInventoryService
) => {
  const [levels] = await inventoryService.listInventoryLevels({
    item_id: items.map((i) => i.id),
  })

  const levelsWithAvailability: LevelWithAvailability[] = await Promise.all(
    levels.map(async (level) => {
      const availability = await inventoryService.retrieveAvailableQuantity(
        level.item_id,
        [level.location_id]
      )
      return {
        ...level,
        available_quantity: availability,
      }
    })
  )

  return buildLevelsByItemId(levelsWithAvailability, locationIds)
}

export const joinLevels = async (
  items: InventoryItemDTO[],
  locationIds: string[],
  inventoryService: IInventoryService
) => {
  const levelsByItemId = await getLevelsByItemId(
    items,
    locationIds,
    inventoryService
  )

  const responseItems = items.map((i) => {
    const responseItem: ResponseInventoryItem = { ...i }
    responseItem.location_levels = levelsByItemId[i.id] || []
    return responseItem
  })
  return responseItems
}

type ResponseInventoryItem = Partial<InventoryItemDTO> & {
  location_levels?: InventoryLevelDTO[]
}
