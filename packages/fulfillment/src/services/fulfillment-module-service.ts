import {
  Context,
  DAL,
  FindConfig,
  FulfillmentTypes,
  IFulfillmentModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  SoftDeleteReturn,
  UpdateFulfillmentSetDTO,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  ModulesSdkUtils,
} from "@medusajs/utils"

import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import { FulfillmentSet } from "@models"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  fulfillmentService: ModulesSdkTypes.InternalModuleService<any>
}

export default class FulfillmentModuleService<
    TEntity extends FulfillmentSet = FulfillmentSet
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    any, // TODO Create appropriate DTO
    {}
  >(FulfillmentSet, [], entityNameToLinkableKeysMap)
  implements IFulfillmentModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly fulfillmentService_: ModulesSdkTypes.InternalModuleService<TEntity>

  constructor(
    { baseRepository, fulfillmentService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.fulfillmentService_ = fulfillmentService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  create(
    data: FulfillmentTypes.CreateFulfillmentSetDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.FulfillmentSetDTO[]>
  create(
    data: FulfillmentTypes.CreateFulfillmentSetDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.FulfillmentSetDTO>

  @InjectTransactionManager("baseRepository_")
  async create(
    data:
      | FulfillmentTypes.CreateFulfillmentSetDTO
      | FulfillmentTypes.CreateFulfillmentSetDTO[],
    sharedContext?: Context
  ): Promise<
    FulfillmentTypes.FulfillmentSetDTO | FulfillmentTypes.FulfillmentSetDTO[]
  > {
    return []
  }

  createServiceZones(
    data: FulfillmentTypes.CreateServiceZoneDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO[]>
  createServiceZones(
    data: FulfillmentTypes.CreateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO>

  @InjectTransactionManager("baseRepository_")
  createServiceZones(
    data:
      | FulfillmentTypes.CreateServiceZoneDTO[]
      | FulfillmentTypes.CreateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<
    FulfillmentTypes.ServiceZoneDTO | FulfillmentTypes.ServiceZoneDTO[]
  > {
    return Promise.resolve([])
  }

  createShippingOptions(
    data: FulfillmentTypes.CreateShippingOptionDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionDTO[]>
  createShippingOptions(
    data: FulfillmentTypes.CreateShippingOptionDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionDTO>

  @InjectTransactionManager("baseRepository_")
  createShippingOptions(
    data:
      | FulfillmentTypes.CreateShippingOptionDTO[]
      | FulfillmentTypes.CreateShippingOptionDTO,
    sharedContext?: Context
  ): Promise<
    FulfillmentTypes.ShippingOptionDTO | FulfillmentTypes.ShippingOptionDTO[]
  > {
    return Promise.resolve([])
  }

  deleteServiceZones(ids: string[], sharedContext?: Context): Promise<void>
  deleteServiceZones(id: string, sharedContext?: Context): Promise<void>

  @InjectTransactionManager("baseRepository_")
  deleteServiceZones(
    ids: string[] | string,
    sharedContext?: Context
  ): Promise<void> {
    return Promise.resolve()
  }

  deleteShippingOptions(ids: string[], sharedContext?: Context): Promise<void>
  deleteShippingOptions(id: string, sharedContext?: Context): Promise<void>

  @InjectTransactionManager("baseRepository_")
  deleteShippingOptions(
    ids: string[] | string,
    sharedContext?: Context
  ): Promise<void> {
    return Promise.resolve()
  }

  @InjectManager("baseRepository_")
  listAndCountServiceZones(
    filters?: FulfillmentTypes.FilterableServiceZoneProps,
    config?: FindConfig<FulfillmentTypes.ServiceZoneDTO>,
    sharedContext?: Context
  ): Promise<[FulfillmentTypes.ServiceZoneDTO[], number]> {
    return Promise.resolve([[], 0])
  }

  @InjectManager("baseRepository_")
  listAndCountShippingOptions(
    filters?: FulfillmentTypes.FilterableShippingOptionProps,
    config?: FindConfig<FulfillmentTypes.ShippingOptionDTO>,
    sharedContext?: Context
  ): Promise<[FulfillmentTypes.ShippingOptionDTO[], number]> {
    return Promise.resolve([[], 0])
  }

  @InjectManager("baseRepository_")
  listServiceZones(
    filters?: FulfillmentTypes.FilterableServiceZoneProps,
    config?: FindConfig<FulfillmentTypes.ServiceZoneDTO>,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO[]> {
    return Promise.resolve([])
  }

  @InjectManager("baseRepository_")
  listShippingOptions(
    filters?: FulfillmentTypes.FilterableShippingOptionProps,
    config?: FindConfig<FulfillmentTypes.ShippingOptionDTO>,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionDTO[]> {
    return Promise.resolve([])
  }

  @InjectTransactionManager("baseRepository_")
  softDeleteServiceZones<TReturnableLinkableKeys = string>(
    serviceZoneIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void> {
    return Promise.resolve()
  }

  @InjectTransactionManager("baseRepository_")
  softDeleteShippingOptions<TReturnableLinkableKeys = string>(
    shippingOptionsIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void> {
    return Promise.resolve()
  }

  update(
    data: FulfillmentTypes.UpdateFulfillmentSetDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.FulfillmentSetDTO[]>
  update(
    data: FulfillmentTypes.UpdateFulfillmentSetDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.FulfillmentSetDTO>

  @InjectTransactionManager("baseRepository_")
  update(
    data: UpdateFulfillmentSetDTO[] | UpdateFulfillmentSetDTO,
    sharedContext?: Context
  ): Promise<
    FulfillmentTypes.FulfillmentSetDTO[] | FulfillmentTypes.FulfillmentSetDTO
  > {
    return Promise.resolve([])
  }

  updateServiceZones(
    data: FulfillmentTypes.UpdateServiceZoneDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO[]>
  updateServiceZones(
    data: FulfillmentTypes.UpdateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO>

  @InjectTransactionManager("baseRepository_")
  updateServiceZones(
    data:
      | FulfillmentTypes.UpdateServiceZoneDTO[]
      | FulfillmentTypes.UpdateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<
    FulfillmentTypes.ServiceZoneDTO[] | FulfillmentTypes.ServiceZoneDTO
  > {
    return Promise.resolve([])
  }

  updateShippingOptions(
    data: FulfillmentTypes.UpdateShippingOptionDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionDTO[]>
  updateShippingOptions(
    data: FulfillmentTypes.UpdateShippingOptionDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionDTO>

  @InjectTransactionManager("baseRepository_")
  updateShippingOptions(
    data:
      | FulfillmentTypes.UpdateShippingOptionDTO[]
      | FulfillmentTypes.UpdateShippingOptionDTO,
    sharedContext?: Context
  ):
    | Promise<FulfillmentTypes.ShippingOptionDTO[]>
    | Promise<FulfillmentTypes.ShippingOptionDTO> {
    return Promise.resolve([])
  }
}
