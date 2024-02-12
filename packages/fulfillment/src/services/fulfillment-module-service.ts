import {
  Context,
  DAL,
  FulfillmentTypes,
  IFulfillmentModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  UpdateFulfillmentSetDTO,
} from "@medusajs/types"
import { InjectTransactionManager, ModulesSdkUtils } from "@medusajs/utils"

import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import { FulfillmentSet, ServiceZone, ShippingOption } from "@models"

const generateMethodForModels = [ServiceZone, ShippingOption]

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  fulfillmentService: ModulesSdkTypes.InternalModuleService<any>
}

export default class FulfillmentModuleService<
    TEntity extends FulfillmentSet = FulfillmentSet
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    FulfillmentTypes.FulfillmentSetDTO,
    {
      FulfillmentSet: { dto: FulfillmentTypes.FulfillmentSetDTO }
      ServiceZone: { dto: FulfillmentTypes.ServiceZoneDTO }
      ShippingOption: { dto: FulfillmentTypes.ShippingOptionDTO }
    }
  >(FulfillmentSet, generateMethodForModels, entityNameToLinkableKeysMap)
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
  async createServiceZones(
    data:
      | FulfillmentTypes.CreateServiceZoneDTO[]
      | FulfillmentTypes.CreateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<
    FulfillmentTypes.ServiceZoneDTO | FulfillmentTypes.ServiceZoneDTO[]
  > {
    return []
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
  async createShippingOptions(
    data:
      | FulfillmentTypes.CreateShippingOptionDTO[]
      | FulfillmentTypes.CreateShippingOptionDTO,
    sharedContext?: Context
  ): Promise<
    FulfillmentTypes.ShippingOptionDTO | FulfillmentTypes.ShippingOptionDTO[]
  > {
    return []
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
  async update(
    data: UpdateFulfillmentSetDTO[] | UpdateFulfillmentSetDTO,
    sharedContext?: Context
  ): Promise<
    FulfillmentTypes.FulfillmentSetDTO[] | FulfillmentTypes.FulfillmentSetDTO
  > {
    return []
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
  async updateServiceZones(
    data:
      | FulfillmentTypes.UpdateServiceZoneDTO[]
      | FulfillmentTypes.UpdateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<
    FulfillmentTypes.ServiceZoneDTO[] | FulfillmentTypes.ServiceZoneDTO
  > {
    return []
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
  async updateShippingOptions(
    data:
      | FulfillmentTypes.UpdateShippingOptionDTO[]
      | FulfillmentTypes.UpdateShippingOptionDTO,
    sharedContext?: Context
  ): Promise<
    FulfillmentTypes.ShippingOptionDTO[] | FulfillmentTypes.ShippingOptionDTO
  > {
    return []
  }
}
