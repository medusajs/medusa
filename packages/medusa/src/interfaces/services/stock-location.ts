import { FindConfig } from "../../types/common"

import {
  StockLocationDTO,
  FilterableStockLocationProps,
  CreateStockLocationInput,
  UpdateStockLocationInput,
} from "../../types/stock-location"

export interface IStockLocationService {
  list(
    selector: FilterableStockLocationProps,
    config?: FindConfig<StockLocationDTO>
  ): Promise<StockLocationDTO[]>

  listAndCount(
    selector: FilterableStockLocationProps,
    config?: FindConfig<StockLocationDTO>
  ): Promise<[StockLocationDTO[], number]>

  retrieve(id: string): Promise<StockLocationDTO>

  create(input: CreateStockLocationInput): Promise<StockLocationDTO>

  update(id: string, input: UpdateStockLocationInput): Promise<StockLocationDTO>
}
