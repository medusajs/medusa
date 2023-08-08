import { FindConfig } from "../common/common"
import { JoinerServiceConfig } from "../joiner"
import { SharedContext } from "../shared-context"
import {
  CreateStockLocationInput,
  FilterableStockLocationProps,
  StockLocationDTO,
  UpdateStockLocationInput,
} from "./common"

export interface IStockLocationService {
  __joinerConfig(): JoinerServiceConfig
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
