import { IInventoryService } from "../../../../../interfaces"
import {
  InventoryItemDTO,
  InventoryLevelDTO,
} from "../../../../../types/inventory"

export const joinLevels = async (
  items: InventoryItemDTO[],
  inventoryService: IInventoryService
) => {
  const [levels] = await inventoryService.listInventoryLevels({
    item_id: items.map((i) => i.id),
  })

  const levelsByItemId = levels.reduce((acc, level) => {
    if (level.item_id in acc) {
      acc[level.item_id].push(level)
    } else {
      acc[level.item_id] = [level]
    }

    return acc
  }, {})

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
