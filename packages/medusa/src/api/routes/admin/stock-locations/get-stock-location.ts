import { IStockLocationService } from "../../../../interfaces"
import { Request, Response } from "express"
import { FindParams } from "../../../../types/common"

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const locationService: IStockLocationService = req.scope.resolve(
    "stockLocationService"
  )
  const data = await locationService.retrieve(id)

  res.status(200).json({ stock_location: data })
}

export class AdminGetStockLocationsLocationParams extends FindParams {}
