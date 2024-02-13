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
import {
  InjectTransactionManager,
  ModulesSdkUtils,
  promiseAll,
} from "@medusajs/utils"

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
    const data_ = Array.isArray(data) ? data : [data]

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

    const serviceZoneGeoZonesMap = new Map<
      string,
      Map<string, FulfillmentTypes.CreateGeoZoneDTO | { id: string }>
    >()

    const serviceZonesToCreate: FulfillmentTypes.CreateServiceZoneDTO[] = []
    const geoZonesToCreate: FulfillmentTypes.CreateGeoZoneDTO[] = []
    let serviceZoneIds: string[] = []
    let geoZoneIds: string[] = []

    data_.forEach(({ service_zones }) => {
      service_zones?.forEach((serviceZone) => {
        if ("id" in serviceZone) {
          serviceZoneIds.push(serviceZone.id)
        }

        if ("geo_zones" in serviceZone && serviceZone.geo_zones) {
          serviceZone.geo_zones.forEach((geoZone) => {
            if ("id" in geoZone) {
              geoZoneIds.push(geoZone.id)
            }
          })
        }
      })
    })

    serviceZoneIds = serviceZoneIds.filter(Boolean)
    geoZoneIds = geoZoneIds.filter(Boolean)

    let existingServiceZones: TServiceZoneEntity[] = []
    let existingServiceZonesMap = new Map()
    let existingGeoZones: TGeoZoneEntity[] = []
    let existingGeoZonesMap = new Map()
    const promises: Promise<any>[] = []

    if (serviceZoneIds.length) {
      promises.push(
        this.serviceZoneService_
          .list(
            {
              id: serviceZoneIds,
            },
            {
              select: ["id", "name"],
            },
            sharedContext
          )
          .then((serviceZones) => {
            existingServiceZones = serviceZones
            existingServiceZonesMap = new Map(
              existingServiceZones.map((serviceZone) => [
                serviceZone.id,
                serviceZone,
              ])
            )
          })
      )
    }

    if (geoZoneIds.length) {
      promises.push(
        this.geoZoneService_
          .list(
            {
              id: geoZoneIds,
            },
            {},
            sharedContext
          )
          .then((geoZones) => {
            existingGeoZones = geoZones
            existingGeoZonesMap = new Map(
              existingGeoZones.map((geoZone) => [geoZone.id, geoZone])
            )
          })
      )
    }

    await promiseAll(promises)

    const getGeoZoneIdentifier = (
      geoZone: FulfillmentTypes.CreateGeoZoneDTO | { id: string },
      { preventIdUsage = false }: { preventIdUsage?: boolean } = {}
    ) => {
      if (!preventIdUsage && "id" in geoZone) {
        return geoZone.id
      }

      let identifier = ("type" in geoZone && geoZone.type) || ""

      if ("country_code" in geoZone && geoZone.country_code) {
        identifier += geoZone.country_code
      }
      if ("province_code" in geoZone && geoZone.province_code) {
        identifier += geoZone.province_code
      }
      if ("city" in geoZone && geoZone.city) {
        identifier += geoZone.city
      }
      if ("postal_expression" in geoZone && geoZone.postal_expression) {
        identifier += JSON.stringify(geoZone.postal_expression)
      }

      return identifier
    }

    data_.forEach(({ service_zones, ...fulfillmentSetDataOnly }) => {
      fulfillmentSetMap.set(fulfillmentSetDataOnly.name, fulfillmentSetDataOnly)

      /**
       * If there is any service zone to process
       * store the service zones to create while populating the fulfillment set service zone map
       * in order to be able after creating the service zones to re update the map with the
       * newly created service zones and then assign them to the fulfillment sets to be
       * create attached.
       */

      if (service_zones?.length) {
        const serviceZoneTuple: [
          string,
          Required<FulfillmentTypes.CreateFulfillmentSetDTO>["service_zones"][number]
        ][] = service_zones.map((serviceZone) => {
          let geoZoneTuple: [
            string,
            FulfillmentTypes.CreateGeoZoneDTO | { id: string }
          ][] = []

          if ("geo_zones" in serviceZone && serviceZone.geo_zones) {
            const geo_zones = serviceZone.geo_zones
            delete serviceZone.geo_zones

            geoZoneTuple = geo_zones.map((geoZone) => {
              let existingGeoZone =
                "id" in geoZone ? existingGeoZonesMap.get(geoZone.id)! : null

              if (!("id" in geoZone)) {
                geoZonesToCreate.push(geoZone)
              }

              const geoZoneIdentifier = getGeoZoneIdentifier(geoZone)

              return [geoZoneIdentifier, existingGeoZone ?? geoZone]
            })
          }

          let existingZone =
            "id" in serviceZone
              ? existingServiceZonesMap.get(serviceZone.id)!
              : null

          if (!("id" in serviceZone)) {
            serviceZonesToCreate.push(serviceZone)
          }

          const serviceZoneIdentifier =
            "id" in serviceZone ? serviceZone.id : serviceZone.name

          serviceZoneGeoZonesMap.set(
            serviceZoneIdentifier,
            new Map(geoZoneTuple)
          )

          return [serviceZoneIdentifier, existingZone ?? serviceZone]
        })

        fulfillmentSetServiceZonesMap.set(
          fulfillmentSetDataOnly.name,
          new Map(serviceZoneTuple)
        )
      }
    })

    if (geoZonesToCreate.length) {
      // deduplicate geo zones to create
      const geoZoneToCreateMap = new Map(
        geoZonesToCreate.map((geoZone) => [
          getGeoZoneIdentifier(geoZone),
          geoZone,
        ])
      )
      const createdGeoZones = await this.geoZoneService_.create(
        [...geoZoneToCreateMap.values()],
        sharedContext
      )

      for (const [serviceZoneName, geoZoneMap] of serviceZoneGeoZonesMap) {
        for (const createdGeoZone of createdGeoZones) {
          const geoZoneIdentifier = getGeoZoneIdentifier(createdGeoZone, {
            preventIdUsage: true,
          })

          if (geoZoneMap.has(geoZoneIdentifier)) {
            geoZoneMap.set(geoZoneIdentifier, createdGeoZone)
          }
        }

        for (const serviceZone of serviceZonesToCreate) {
          if (serviceZone.name === serviceZoneName) {
            serviceZone.geo_zones = [...geoZoneMap.values()]
          }
        }
      }
    }

    if (serviceZonesToCreate.length) {
      // Deduplicate service zones to create
      const serviceZoneToCreateMap = new Map(
        serviceZonesToCreate.map((serviceZone) => [
          serviceZone.name,
          serviceZone,
        ])
      )
      const createdServiceZones = await this.serviceZoneService_.create(
        [...serviceZoneToCreateMap.values()],
        sharedContext
      )

      for (const [
        fulfillmentSetName,
        serviceZoneMap,
      ] of fulfillmentSetServiceZonesMap) {
        for (const createdServiceZone of createdServiceZones) {
          if (serviceZoneMap.has(createdServiceZone.name)) {
            serviceZoneMap.set(createdServiceZone.name, createdServiceZone)
          }
        }

        const fulfillmentSet = fulfillmentSetMap.get(fulfillmentSetName)!
        fulfillmentSet.service_zones = [...serviceZoneMap.values()]
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
