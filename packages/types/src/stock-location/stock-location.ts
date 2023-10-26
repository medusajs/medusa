import {
  CreateStockLocationInput,
  FilterableStockLocationProps,
  StockLocationDTO,
  UpdateStockLocationInput,
} from "./common"

import { FindConfig } from "../common/common"
import { Context } from "../shared-context"

export interface IStockLocationService {
  list(
    selector: FilterableStockLocationProps,
    config?: FindConfig<StockLocationDTO>,
    context?: Context
  ): Promise<StockLocationDTO[]>

  listAndCount(
    selector: FilterableStockLocationProps,
    config?: FindConfig<StockLocationDTO>,
    context?: Context
  ): Promise<[StockLocationDTO[], number]>

  retrieve(
    id: string,
    config?: FindConfig<StockLocationDTO>,
    context?: Context
  ): Promise<StockLocationDTO>

  create(
    input: CreateStockLocationInput,
    context?: Context
  ): Promise<StockLocationDTO>

  update(
    id: string,
    input: UpdateStockLocationInput,
    context?: Context
  ): Promise<StockLocationDTO>

  delete(id: string, context?: Context): Promise<void>
}
