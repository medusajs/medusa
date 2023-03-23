import { FindConfig } from "../common/common"
import {
  CreateStockLocationInput,
  FilterableStockLocationProps,
  StockLocationDTO,
  UpdateStockLocationInput,
} from "./common"

export interface IStockLocationService {
  list(
    selector: FilterableStockLocationProps,
    config?: FindConfig<StockLocationDTO>
  ): Promise<StockLocationDTO[]>

  listAndCount(
    selector: FilterableStockLocationProps,
    config?: FindConfig<StockLocationDTO>
  ): Promise<[StockLocationDTO[], number]>

  retrieve(
    id: string,
    config?: FindConfig<StockLocationDTO>
  ): Promise<StockLocationDTO>

  create(input: CreateStockLocationInput): Promise<StockLocationDTO>

  update(id: string, input: UpdateStockLocationInput): Promise<StockLocationDTO>

  delete(id: string): Promise<void>
}
