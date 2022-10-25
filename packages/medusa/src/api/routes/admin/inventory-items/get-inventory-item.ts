import { IInventoryService } from "../../../../interfaces"
import { Request, Response } from "express"
import { FindParams } from "../../../../types/common"
import { joinLevels } from "./utils/join-levels"

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")
  const item = await inventoryService.retrieveInventoryItem(id)

  const [data] = await joinLevels([item], [], inventoryService)

  res.status(200).json({ inventory_item: data })
}

export class AdminGetInventoryItemsItemParams extends FindParams {}
