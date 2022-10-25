import { Request, Response } from "express"
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator"

import { IInventoryService } from "../../../../interfaces"
import { FindParams } from "../../../../types/common"

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")

  console.log(req.validatedBody)

  await inventoryService.updateInventoryItem(
    id,
    req.validatedBody as AdminPostInventoryItemsInventoryItemReq
  )

  const inventoryItem = await inventoryService.retrieveInventoryItem(
    id,
    req.retrieveConfig
  )

  res.status(200).json({ inventory_item: inventoryItem })
}

export class AdminPostInventoryItemsInventoryItemReq {
  @IsString()
  @IsOptional()
  sku?: string

  @IsOptional()
  @IsString()
  origin_country?: string

  @IsOptional()
  @IsString()
  hs_code?: string

  @IsOptional()
  @IsString()
  mid_code?: string

  @IsOptional()
  @IsString()
  material?: string

  @IsOptional()
  @IsNumber()
  weight?: number

  @IsOptional()
  @IsNumber()
  height?: number

  @IsOptional()
  @IsNumber()
  length?: number

  @IsOptional()
  @IsNumber()
  width?: number

  @IsBoolean()
  @IsOptional()
  requires_shipping?: boolean
}

export class AdminPostInventoryItemsInventoryItemParams extends FindParams {}
