import { IsBoolean, IsOptional } from "class-validator"
import { Transform, Type } from "class-transformer"
import { IsType } from "../../../../utils/validators/is-type"
import { joinLevels } from "./utils/join-levels"

import { IInventoryService } from "../../../../interfaces"
import {
  extendedFindParamsMixin,
  StringComparisonOperator,
  NumericalComparisonOperator,
} from "../../../../types/common"
import { Request, Response } from "express"

export default async (req: Request, res: Response) => {
  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")

  const { filterableFields, listConfig } = req
  const { skip, take } = listConfig

  const [items, count] = await inventoryService.listInventoryItems(
    filterableFields,
    listConfig
  )

  const responseItems = await joinLevels(items, inventoryService)

  res.status(200).json({
    inventory_items: responseItems,
    count,
    offset: skip,
    limit: take,
  })
}

export class AdminGetInventoryItemParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  @IsOptional()
  @IsType([String, [String]])
  sku?: string | string[]

  @IsOptional()
  @IsType([String, [String]])
  origin_country?: string | string[]

  @IsOptional()
  @IsType([String, [String]])
  mid_code?: string | string[]

  @IsOptional()
  @IsType([String, [String]])
  material?: string | string[]

  @IsOptional()
  @IsType([String, [String], StringComparisonOperator])
  hs_code?: string | string[] | StringComparisonOperator

  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  weight?: number | NumericalComparisonOperator

  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  length?: number | NumericalComparisonOperator

  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  height?: number | NumericalComparisonOperator

  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  width?: number | NumericalComparisonOperator

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  requires_shipping?: boolean
}
