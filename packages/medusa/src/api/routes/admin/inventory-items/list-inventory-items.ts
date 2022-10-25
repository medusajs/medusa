import { Request, Response } from "express"
import { IsString, IsBoolean, IsOptional } from "class-validator"
import { Transform, Type } from "class-transformer"
import { IsType } from "../../../../utils/validators/is-type"
import { getLevelsByItemId } from "./utils/join-levels"
import { getVariantsByItemId } from "./utils/join-variants"
import {
  ProductVariantInventoryService,
  ProductVariantService,
} from "../../../../services"
import { IInventoryService } from "../../../../interfaces"
import { ProductVariant } from "../../../../models"
import {
  InventoryLevelDTO,
  InventoryItemDTO,
} from "../../../../types/inventory"
import {
  extendedFindParamsMixin,
  StringComparisonOperator,
  NumericalComparisonOperator,
} from "../../../../types/common"

export default async (req: Request, res: Response) => {
  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")
  const productVariantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )

  const { filterableFields, listConfig } = req
  const { skip, take } = listConfig

  let locationIds: string[] = []

  if (filterableFields.location_id) {
    locationIds = Array.isArray(filterableFields.location_id)
      ? filterableFields.location_id
      : [filterableFields.location_id]

    delete filterableFields.location_id
  }

  const [items, count] = await inventoryService.listInventoryItems(
    filterableFields,
    listConfig
  )

  const levelsByItemId = await getLevelsByItemId(
    items,
    locationIds,
    inventoryService
  )
  const variantsByItemId = await getVariantsByItemId(
    items,
    productVariantInventoryService,
    productVariantService
  )

  const responseItems = items.map((i) => {
    const responseItem: ResponseInventoryItem = { ...i }
    responseItem.variant = variantsByItemId[i.id] || {}
    responseItem.location_levels = levelsByItemId[i.id] || []
    return responseItem
  })

  res.status(200).json({
    inventory_items: responseItems,
    count,
    offset: skip,
    limit: take,
  })
}
type ResponseInventoryItem = Partial<InventoryItemDTO> & {
  location_levels?: InventoryLevelDTO[]
  variant?: ProductVariant
}

export class AdminGetInventoryItemsParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  @IsOptional()
  @IsString()
  q?: string

  @IsOptional()
  @IsType([String, [String]])
  location_id?: string | string[]

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
