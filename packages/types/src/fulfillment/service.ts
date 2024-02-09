import { IModuleService } from "../modules-sdk"
import { FulfillmentSetDTO, ServiceZoneDTO } from "./common"
import { FindConfig } from "../common"
import { Context } from "../shared-context"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { CreateFulfillmentSetDTO } from "./mutations/fulfillment-set"

export interface IFulfillmentModuleService extends IModuleService {
  /**
   * Create a new fulfillment set
   * @param data
   * @param sharedContext
   */
  create(
    data: CreateFulfillmentSetDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentSetDTO[]>
  create(
    data: CreateFulfillmentSetDTO,
    sharedContext?: Context
  ): Promise<FulfillmentSetDTO>

  /**
   * Create a new service zone
   * @param data
   * @param sharedContext
   */
  createServiceZones(
    data: CreateFulfillmentSetDTO[],
    sharedContext?: Context
  ): Promise<ServiceZoneDTO[]>
  createServiceZones(
    data: CreateFulfillmentSetDTO,
    sharedContext?: Context
  ): Promise<ServiceZoneDTO>

  update(
    data: any[], // TODO Create appropriate DTO
    sharedContext?: Context
  ): Promise<FulfillmentSetDTO[]>
  update(
    data: any, // TODO Create appropriate DTO
    sharedContext?: Context
  ): Promise<FulfillmentSetDTO>

  delete(ids: string[], sharedContext?: Context): Promise<void>
  delete(id: string, sharedContext?: Context): Promise<void>

  retrieve(
    id: string,
    config?: FindConfig<FulfillmentSetDTO>,
    sharedContext?: Context
  ): Promise<FulfillmentSetDTO>

  list(
    filters?: any, // TODO Create appropriate filter type
    config?: FindConfig<FulfillmentSetDTO>,
    sharedContext?: Context
  ): Promise<FulfillmentSetDTO[]>

  listAndCount(
    filters?: any, // TODO Create appropriate filter type
    config?: FindConfig<FulfillmentSetDTO>,
    sharedContext?: Context
  ): Promise<[FulfillmentSetDTO[], number]>

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
