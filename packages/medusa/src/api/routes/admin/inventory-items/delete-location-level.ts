import { Request, Response } from "express"
import { IInventoryService } from "../../../../interfaces"

export default async (req: Request, res: Response) => {
  const { id, location_id } = req.params

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")

  await inventoryService.deleteInventoryLevel(id, location_id)

  const inventoryItem = await inventoryService.retrieveInventoryItem(
    id,
    req.retrieveConfig
  )

  res.status(200).json({ inventory_item: inventoryItem })
}
