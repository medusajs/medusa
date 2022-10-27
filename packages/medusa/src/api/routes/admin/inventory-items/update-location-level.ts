import { Request, Response } from "express"
import { IsOptional, IsNumber } from "class-validator"

import { IInventoryService } from "../../../../interfaces"
import { FindParams } from "../../../../types/common"

export default async (req: Request, res: Response) => {
  const { id, location_id } = req.params

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")

  const validatedBody =
    req.validatedBody as AdminPostInventoryItemsItemLocationLevelsLevelReq

  await inventoryService.updateInventoryLevel(id, location_id, validatedBody)

  const inventoryItem = await inventoryService.retrieveInventoryItem(
    id,
    req.retrieveConfig
  )

  res.status(200).json({ inventory_item: inventoryItem })
}

export class AdminPostInventoryItemsItemLocationLevelsLevelReq {
  @IsOptional()
  @IsNumber()
  incoming_quantity?: number

  @IsOptional()
  @IsNumber()
  stocked_quantity?: number
}

// eslint-disable-next-line
export class AdminPostInventoryItemsItemLocationLevelsLevelParams extends FindParams {}
