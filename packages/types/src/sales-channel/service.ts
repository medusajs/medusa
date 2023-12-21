import { ModuleJoinerConfig } from "../modules-sdk"
import {
  CreateSalesChannelDTO,
  FilterableSalesChannelProps,
  SalesChannelDTO,
  UpdateSalesChannelDTO,
} from "./common"
import { FindConfig } from "../common"
import { Context } from "../shared-context"

export interface ISalesChannelModuleService {
  /**
   * @ignore
   */
  __joinerConfig(): ModuleJoinerConfig

  create(
    data: CreateSalesChannelDTO[],
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>

  update(
    data: UpdateSalesChannelDTO[],
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>

  delete(ids: string[], sharedContext?: Context): Promise<void>

  retrieve(
    id: string,
    config?: FindConfig<SalesChannelDTO>,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>

  list(
    filters?: FilterableSalesChannelProps,
    config?: FindConfig<SalesChannelDTO>,
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>

  listAndCount(
    filters?: FilterableSalesChannelProps,
    config?: FindConfig<SalesChannelDTO>,
    sharedContext?: Context
  ): Promise<[SalesChannelDTO[], number]>
}
