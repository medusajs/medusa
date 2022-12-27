import { IsOptional } from "class-validator"
import { IsType } from "../../../../utils/validators/is-type"

import { IStockLocationService } from "../../../../interfaces"
import { extendedFindParamsMixin } from "../../../../types/common"
import { Request, Response } from "express"

export default async (req: Request, res: Response) => {
  const stockLocationService: IStockLocationService = req.scope.resolve(
    "stockLocationService"
  )

  const { filterableFields, listConfig } = req
  const { skip, take } = listConfig

  const [locations, count] = await stockLocationService.listAndCount(
    filterableFields,
    listConfig
  )

  res.status(200).json({
    stock_locations: locations,
    count,
    offset: skip,
    limit: take,
  })
}

export class AdminGetStockLocationsParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  @IsOptional()
  @IsType([String, [String]])
  name?: string | string[]

  @IsOptional()
  @IsType([String, [String]])
  address_id?: string | string[]
}
