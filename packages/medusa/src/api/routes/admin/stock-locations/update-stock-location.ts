import { Request, Response } from "express"
import { Type } from "class-transformer"
import { ValidateNested, IsOptional, IsString } from "class-validator"

import { IStockLocationService } from "../../../../interfaces"
import { FindParams } from "../../../../types/common"

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const locationService: IStockLocationService = req.scope.resolve(
    "stockLocationService"
  )

  const data = await locationService.update(
    id,
    req.validatedBody as AdminPostStockLocationsLocationReq
  )

  res.status(200).json({ stock_location: data })
}

class StockLocationAddress {
  @IsString()
  address_1: string

  @IsOptional()
  @IsString()
  address_2?: string

  @IsOptional()
  @IsString()
  city?: string

  @IsString()
  country_code: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  postal_code?: string

  @IsOptional()
  @IsString()
  province?: string
}

export class AdminPostStockLocationsLocationReq {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => StockLocationAddress)
  address?: StockLocationAddress

  @IsOptional()
  @IsString()
  address_id: string
}

export class AdminPostStockLocationsLocationParams extends FindParams {}
