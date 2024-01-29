import { IModuleService } from "../modules-sdk"
import { FilterableSalesChannelProps, SalesChannelDTO } from "./common"
import { FindConfig } from "../common"
import { Context } from "../shared-context"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { CreateSalesChannelDTO, UpdateSalesChannelDTO } from "./mutations"

export interface ISalesChannelModuleService extends IModuleService {
  create(
    data: CreateSalesChannelDTO[],
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>
  create(
    data: CreateSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>

  update(
    data: UpdateSalesChannelDTO[],
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>
  update(
    data: UpdateSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>

  delete(ids: string[], sharedContext?: Context): Promise<void>
  delete(id: string, sharedContext?: Context): Promise<void>

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

  softDelete<TReturnableLinkableKeys extends string = string>(
    salesChannelIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  restore<TReturnableLinkableKeys extends string = string>(
    salesChannelIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
}
