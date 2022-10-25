import { Request, Response } from "express"

import { IInventoryService } from "../../../../interfaces"
import { FindParams } from "../../../../types/common"

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")

  const [levels] = await inventoryService.listInventoryLevels({
    item_id: id,
  })

  res.status(200).json({
    inventory_item: {
      id,
      location_levels: levels,
    },
  })
}

// eslint-disable-next-line
export class AdminGetInventoryItemsItemLocationLevelsParams extends FindParams {}
