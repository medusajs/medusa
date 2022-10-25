import { Request, Response } from "express"
import { IsNumber, IsString } from "class-validator"

import { IInventoryService } from "../../../../interfaces"
import { FindParams } from "../../../../types/common"

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")

  const validatedBody =
    req.validatedBody as AdminPostInventoryItemsItemLocationLevelsReq

  await inventoryService.createInventoryLevel({
    item_id: id,
    location_id: validatedBody.location_id,
    incoming_quantity: 0,
    stocked_quantity: validatedBody.stocked_quantity,
  })

  const inventoryItem = await inventoryService.retrieveInventoryItem(
    id,
    req.retrieveConfig
  )

  res.status(200).json({ inventory_item: inventoryItem })
}

export class AdminPostInventoryItemsItemLocationLevelsReq {
  @IsString()
  location_id: string

  @IsNumber()
  stocked_quantity: number
}

// eslint-disable-next-line
export class AdminPostInventoryItemsItemLocationLevelsParams extends FindParams {}
