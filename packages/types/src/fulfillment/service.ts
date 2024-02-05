import { IModuleService } from "../modules-sdk"
import { FulfillmentDTO } from "./common"
import { FindConfig } from "../common"
import { Context } from "../shared-context"
import { RestoreReturn, SoftDeleteReturn } from "../dal"

export interface IFulfillmentModuleService extends IModuleService {
  create(
    data: any[], // TODO Create appropriate DTO
    sharedContext?: Context
  ): Promise<FulfillmentDTO[]>
  create(
    data: any, // TODO Create appropriate DTO
    sharedContext?: Context
  ): Promise<FulfillmentDTO>

  update(
    data: any[], // TODO Create appropriate DTO
    sharedContext?: Context
  ): Promise<FulfillmentDTO[]>
  update(
    data: any, // TODO Create appropriate DTO
    sharedContext?: Context
  ): Promise<FulfillmentDTO>

  delete(ids: string[], sharedContext?: Context): Promise<void>
  delete(id: string, sharedContext?: Context): Promise<void>

  retrieve(
    id: string,
    config?: FindConfig<FulfillmentDTO>,
    sharedContext?: Context
  ): Promise<FulfillmentDTO>

  list(
    filters?: any, // TODO Create appropriate filter type
    config?: FindConfig<FulfillmentDTO>,
    sharedContext?: Context
  ): Promise<FulfillmentDTO[]>

  listAndCount(
    filters?: any, // TODO Create appropriate filter type
    config?: FindConfig<FulfillmentDTO>,
    sharedContext?: Context
  ): Promise<[FulfillmentDTO[], number]>

  softDelete<TReturnableLinkableKeys extends string = string>(
    fulfillmentIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  restore<TReturnableLinkableKeys extends string = string>(
    fulfillmentIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
}
