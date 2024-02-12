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
import { FulfillmentSet, GeoZone, ServiceZone, ShippingOption } from "@models"

const generateMethodForModels = [ServiceZone, ShippingOption]

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  fulfillmentSetService: ModulesSdkTypes.InternalModuleService<any>
  serviceZoneService: ModulesSdkTypes.InternalModuleService<any>
  geoZoneService: ModulesSdkTypes.InternalModuleService<any>
}

export default class FulfillmentModuleService<
    TEntity extends FulfillmentSet = FulfillmentSet,
    TServiceZoneEntity extends ServiceZone = ServiceZone,
    TGeoZoneEntity extends GeoZone = GeoZone
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
  protected readonly fulfillmentSetService_: ModulesSdkTypes.InternalModuleService<TEntity>
  protected readonly serviceZoneService_: ModulesSdkTypes.InternalModuleService<TServiceZoneEntity>
  protected readonly geoZoneService_: ModulesSdkTypes.InternalModuleService<TGeoZoneEntity>

  constructor(
    {
      baseRepository,
      fulfillmentSetService,
      serviceZoneService,
      geoZoneService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.fulfillmentSetService_ = fulfillmentSetService
    this.serviceZoneService_ = serviceZoneService
    this.geoZoneService_ = geoZoneService
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
    const data_: FulfillmentTypes.CreateFulfillmentSetDTO[] = Array.isArray(
      data
    )
      ? data
      : [data]

    const fulfillmentSetMap = new Map<
      string,
      FulfillmentTypes.CreateFulfillmentSetDTO
    >()

    const fulfillmentSetServiceZonesMap = new Map<
      string,
      Map<
        string,
        Required<FulfillmentTypes.CreateFulfillmentSetDTO>["service_zones"][number]
      >
    >()

    const serviceZoneToCreate: FulfillmentTypes.CreateServiceZoneDTO[] = []

    const serviceZoneIds = data_
      .map(({ service_zones }) => service_zones?.map(({ id }: any) => id))
      .flat()
      .filter(Boolean)

    let existingServiceZones: TServiceZoneEntity[] = []
    let existingServiceZonesMap = new Map()
    if (serviceZoneIds.length) {
      existingServiceZones = await this.serviceZoneService_.list(
        {
          id: serviceZoneIds,
        },
        {
          select: ["id", "name"],
        },
        sharedContext
      )

      existingServiceZonesMap = new Map(
        existingServiceZones.map((serviceZone) => [serviceZone.id, serviceZone])
      )
    }

    data_.forEach(({ service_zones, ...fulfillmentSetDataOnly }) => {
      fulfillmentSetMap.set(fulfillmentSetDataOnly.name, fulfillmentSetDataOnly)

      /**
       * If there is any service zone to process
       * store the service zones to create while populating the fulfillment set service zone map
       * in order to be able after creating the service zones to re update the map with the
       * newly create service zones and then assign them to the fulfillment sets to be
       * to create.
       */

      if (service_zones?.length) {
        const serviceZoneTuple: [
          string,
          Required<FulfillmentTypes.CreateFulfillmentSetDTO>["service_zones"][number]
        ][] = service_zones.map((serviceZone) => {
          let existingZone =
            "id" in serviceZone
              ? existingServiceZonesMap.get(serviceZone.id)!
              : null
          if (!("id" in serviceZone)) {
            serviceZoneToCreate.push(serviceZone)
          }

          const serviceZoneIdentifier =
            "id" in serviceZone ? serviceZone.id : serviceZone.name

          return [serviceZoneIdentifier, existingZone ?? serviceZone]
        })

        fulfillmentSetServiceZonesMap.set(
          fulfillmentSetDataOnly.name,
          new Map(serviceZoneTuple)
        )
      }
    })

    if (serviceZoneToCreate.length) {
      const createdServiceZones = await this.serviceZoneService_.create(
        serviceZoneToCreate,
        sharedContext
      )
      const createdServiceZoneMap = new Map(
        createdServiceZones.map((serviceZone: ServiceZone) => [
          serviceZone.name,
          serviceZone,
        ])
      )

      for (const [
        fulfillmentSetName,
        serviceZoneToCreateMap,
      ] of fulfillmentSetServiceZonesMap) {
        ;[...createdServiceZoneMap.values()].forEach((serviceZone) => {
          if (serviceZoneToCreateMap.has(serviceZone.name)) {
            serviceZoneToCreateMap.set(serviceZone.name, serviceZone)
          }
        })

        const fulfillmentSet = fulfillmentSetMap.get(fulfillmentSetName)!
        fulfillmentSet.service_zones = [...serviceZoneToCreateMap.values()]
        fulfillmentSetMap.set(fulfillmentSetName, fulfillmentSet)
      }
    }

    const createdFulfillmentSets = await this.fulfillmentSetService_.create(
      [...fulfillmentSetMap.values()],
      sharedContext
    )

    return await this.baseRepository_.serialize(createdFulfillmentSets, {
      populate: true,
    })
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
