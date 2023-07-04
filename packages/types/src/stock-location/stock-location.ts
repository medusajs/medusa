import {
  CreateStockLocationInput,
  FilterableStockLocationProps,
  StockLocationDTO,
  UpdateStockLocationInput,
} from "./common"

import { FindConfig } from "../common/common"
import { SharedContext } from "../shared-context"

export interface IStockLocationService {
  list(
    selector: FilterableStockLocationProps,
    config?: FindConfig<StockLocationDTO>,
    context?: SharedContext
  ): Promise<StockLocationDTO[]>

  listAndCount(
    selector: FilterableStockLocationProps,
    config?: FindConfig<StockLocationDTO>,
    context?: SharedContext
  ): Promise<[StockLocationDTO[], number]>

  retrieve(
    id: string,
    config?: FindConfig<StockLocationDTO>,
    context?: SharedContext
  ): Promise<StockLocationDTO>

  create(
    input: CreateStockLocationInput,
    context?: SharedContext
  ): Promise<StockLocationDTO>

  update(
    id: string,
    input: UpdateStockLocationInput,
    context?: SharedContext
  ): Promise<StockLocationDTO>

  delete(id: string, context?: SharedContext): Promise<void>
}
