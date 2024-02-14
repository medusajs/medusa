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
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  promiseAll,
} from "@medusajs/utils"

import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import { FulfillmentSet, GeoZone, ServiceZone, ShippingOption } from "@models"
import { getSetDifference } from "@medusajs/medusa/dist/utils/diff-set"

const generateMethodForModels = [ServiceZone, ShippingOption, GeoZone]

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
      GeoZone: { dto: FulfillmentTypes.GeoZoneDTO }
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

  /**
   * Returns the identifier of a geo zone. The identifier is a string that is
   * generated based on the type of the geo zone and the properties of the geo
   * zone. The identifier is used for map building and retrieval.
   *
   * @param geoZone
   * @param preventIdUsage
   * @protected
   */
  protected static getGeoZoneIdentifier(
    geoZone: Partial<FulfillmentTypes.GeoZoneDTO>,
    object?: any // todo remove
  ): string {
    let identifier: string[] = [geoZone.type!]

    if (geoZone.country_code) {
      identifier.push("cc:" + geoZone.country_code)
    }
    if (geoZone.province_code) {
      identifier.push("pc:" + geoZone.province_code)
    }
    if (geoZone.city) {
      identifier.push("c:" + geoZone.city)
    }
    if (geoZone.postal_expression) {
      identifier.push("pe:" + JSON.stringify(geoZone.postal_expression))
    }

    return identifier.join("_")
  }

  /**
   * Preparation step of the fulfillment set creation. This method is responsible for
   * extracting the service zones and geo zones from the data and then from that
   * data extract the ids of the service zones and geo zones that are already
   * existing in the database. Then it will fetch the existing service zones and
   * geo zones from the database and return them.
   *
   * @param data
   * @param sharedContext
   * @protected
   */
  /*protected async prepareCreateData(
    data: (
      | FulfillmentTypes.CreateFulfillmentSetDTO
      | FulfillmentTypes.UpdateFulfillmentSetDTO
    )[],
    sharedContext?: Context
  ): Promise<{
    existingServiceZones: TServiceZoneEntity[]
    existingServiceZonesMap: Map<string, TServiceZoneEntity>
    existingGeoZones: TGeoZoneEntity[]
    existingGeoZonesMap: Map<string, TGeoZoneEntity>
  }> {
    let serviceZoneIds: string[] = []
    let geoZoneIds: string[] = []

    data.forEach(({ service_zones }) => {
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

    return {
      existingServiceZones,
      existingServiceZonesMap,
      existingGeoZones,
      existingGeoZonesMap,
    }
  }*/

  create(
    data: FulfillmentTypes.CreateFulfillmentSetDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.FulfillmentSetDTO[]>
  create(
    data: FulfillmentTypes.CreateFulfillmentSetDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.FulfillmentSetDTO>

  @InjectManager("baseRepository_")
  async create(
    data:
      | FulfillmentTypes.CreateFulfillmentSetDTO
      | FulfillmentTypes.CreateFulfillmentSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.FulfillmentSetDTO | FulfillmentTypes.FulfillmentSetDTO[]
  > {
    const createdFulfillmentSets = await this.create_(data, sharedContext)

    return await this.baseRepository_.serialize<
      FulfillmentTypes.FulfillmentSetDTO | FulfillmentTypes.FulfillmentSetDTO[]
    >(createdFulfillmentSets, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data:
      | FulfillmentTypes.CreateFulfillmentSetDTO
      | FulfillmentTypes.CreateFulfillmentSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity | TEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]

    const createdFulfillmentSets = await this.fulfillmentSetService_.create(
      data_,
      sharedContext
    )

    return Array.isArray(data)
      ? createdFulfillmentSets
      : createdFulfillmentSets[0]
  }

  createServiceZones(
    data: FulfillmentTypes.CreateServiceZoneDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO[]>
  createServiceZones(
    data: FulfillmentTypes.CreateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO>

  @InjectManager("baseRepository_")
  async createServiceZones(
    data:
      | FulfillmentTypes.CreateServiceZoneDTO[]
      | FulfillmentTypes.CreateServiceZoneDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.ServiceZoneDTO | FulfillmentTypes.ServiceZoneDTO[]
  > {
    const createdServiceZones = await this.createServiceZones_(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      FulfillmentTypes.ServiceZoneDTO | FulfillmentTypes.ServiceZoneDTO[]
    >(createdServiceZones, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  protected async createServiceZones_(
    data:
      | FulfillmentTypes.CreateServiceZoneDTO[]
      | FulfillmentTypes.CreateServiceZoneDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TServiceZoneEntity | TServiceZoneEntity[]> {
    let data_ = Array.isArray(data) ? data : [data]

    if (!data_.length) {
      return []
    }

    const createdServiceZones = await this.serviceZoneService_.create(
      data_,
      sharedContext
    )

    return Array.isArray(data) ? createdServiceZones : createdServiceZones[0]
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
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.ShippingOptionDTO | FulfillmentTypes.ShippingOptionDTO[]
  > {
    return []
  }

  createGeoZones(
    data: FulfillmentTypes.CreateGeoZoneDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.GeoZoneDTO[]>
  createGeoZones(
    data: FulfillmentTypes.CreateGeoZoneDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.GeoZoneDTO>

  @InjectManager("baseRepository_")
  async createGeoZones(
    data:
      | FulfillmentTypes.CreateGeoZoneDTO
      | FulfillmentTypes.CreateGeoZoneDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<FulfillmentTypes.GeoZoneDTO | FulfillmentTypes.GeoZoneDTO[]> {
    const createdGeoZones = await this.geoZoneService_.create(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<FulfillmentTypes.GeoZoneDTO[]>(
      createdGeoZones,
      {
        populate: true,
      }
    )
  }

  update(
    data: FulfillmentTypes.UpdateFulfillmentSetDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.FulfillmentSetDTO[]>
  update(
    data: FulfillmentTypes.UpdateFulfillmentSetDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.FulfillmentSetDTO>

  @InjectManager("baseRepository_")
  async update(
    data: UpdateFulfillmentSetDTO[] | UpdateFulfillmentSetDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.FulfillmentSetDTO[] | FulfillmentTypes.FulfillmentSetDTO
  > {
    const updatedFulfillmentSets = await this.update_(data, sharedContext)

    return await this.baseRepository_.serialize<
      FulfillmentTypes.FulfillmentSetDTO | FulfillmentTypes.FulfillmentSetDTO[]
    >(updatedFulfillmentSets, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  protected async update_(
    data: UpdateFulfillmentSetDTO[] | UpdateFulfillmentSetDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[] | TEntity> {
    const data_ = Array.isArray(data) ? data : [data]

    if (!data_.length) {
      return []
    }

    const fulfillmentSetIds = data_.map((f) => f.id)
    if (!fulfillmentSetIds.length) {
      return []
    }

    const fulfillmentSets = await this.fulfillmentSetService_.list(
      {
        id: fulfillmentSetIds,
      },
      {
        relations: ["service_zones", "service_zones.geo_zones"],
      },
      sharedContext
    )

    const fulfillmentSetSet = new Set(fulfillmentSets.map((f) => f.id))
    const expectedFulfillmentSetSet = new Set(data_.map((f) => f.id))
    const missingFulfillmentSetIds = getSetDifference(
      expectedFulfillmentSetSet,
      fulfillmentSetSet
    )

    if (missingFulfillmentSetIds.size) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `The following fulfillment sets does not exists: ${Array.from(
          missingFulfillmentSetIds
        ).join(", ")}`
      )
    }

    const fulfillmentSetMap = new Map<string, TEntity>(
      fulfillmentSets.map((f) => [f.id, f])
    )

    // find service zones to delete
    const serviceZoneIdsToDelete: string[] = []
    const geoZoneIdsToDelete: string[] = []
    data_.forEach((fulfillmentSet) => {
      if (fulfillmentSet.service_zones) {
        /**
         * Detect and delete service zones that are not in the updated
         */

        const existingFulfillmentSet = fulfillmentSetMap.get(fulfillmentSet.id)!
        const existingServiceZones = existingFulfillmentSet.service_zones
        const updatedServiceZones = fulfillmentSet.service_zones
        const toDeleteServiceZoneIds = getSetDifference(
          new Set(existingServiceZones.map((s) => s.id)),
          new Set(
            updatedServiceZones
              .map((s) => "id" in s && s.id)
              .filter((id): id is string => !!id)
          )
        )
        if (toDeleteServiceZoneIds.size) {
          serviceZoneIdsToDelete.push(...Array.from(toDeleteServiceZoneIds))
          geoZoneIdsToDelete.push(
            ...existingServiceZones
              .filter((s) => toDeleteServiceZoneIds.has(s.id))
              .flatMap((s) => s.geo_zones.map((g) => g.id))
          )
        }

        /**
         * Detect and re assign service zones to the fulfillment set that are still present
         */

        const serviceZonesMap = new Map(
          existingFulfillmentSet.service_zones.map((serviceZone) => [
            serviceZone.id,
            serviceZone,
          ])
        )
        const serviceZonesSet = new Set(
          existingServiceZones
            .map((s) => "id" in s && s.id)
            .filter((id): id is string => !!id)
        )
        const expectedServiceZoneSet = new Set(
          fulfillmentSet.service_zones
            .map((s) => "id" in s && s.id)
            .filter((id): id is string => !!id)
        )
        const missingServiceZoneIds = getSetDifference(
          expectedServiceZoneSet,
          serviceZonesSet
        )

        if (missingServiceZoneIds.size) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `The following service zones does not exists: ${Array.from(
              missingServiceZoneIds
            ).join(", ")}`
          )
        }

        // re assign service zones to the fulfillment set
        if (fulfillmentSet.service_zones) {
          fulfillmentSet.service_zones = fulfillmentSet.service_zones.map(
            (serviceZone) => {
              if (!("id" in serviceZone)) {
                return serviceZone
              }
              return serviceZonesMap.get(serviceZone.id)!
            }
          )
        }
      }
    })

    if (serviceZoneIdsToDelete.length) {
      await promiseAll([
        this.geoZoneService_.delete(
          {
            id: geoZoneIdsToDelete,
          },
          sharedContext
        ),
        this.serviceZoneService_.delete(
          {
            id: serviceZoneIdsToDelete,
          },
          sharedContext
        ),
      ])
    }

    const updatedFulfillmentSets = await this.fulfillmentSetService_.update(
      data_,
      sharedContext
    )

    return Array.isArray(data)
      ? updatedFulfillmentSets
      : updatedFulfillmentSets[0]
  }

  updateServiceZones(
    data: FulfillmentTypes.UpdateServiceZoneDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO[]>
  updateServiceZones(
    data: FulfillmentTypes.UpdateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO>

  @InjectManager("baseRepository_")
  async updateServiceZones(
    data:
      | FulfillmentTypes.UpdateServiceZoneDTO[]
      | FulfillmentTypes.UpdateServiceZoneDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.ServiceZoneDTO[] | FulfillmentTypes.ServiceZoneDTO
  > {
    const updatedServiceZones = await this.updateServiceZones_(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      FulfillmentTypes.ServiceZoneDTO | FulfillmentTypes.ServiceZoneDTO[]
    >(updatedServiceZones, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateServiceZones_(
    data:
      | FulfillmentTypes.UpdateServiceZoneDTO[]
      | FulfillmentTypes.UpdateServiceZoneDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TServiceZoneEntity | TServiceZoneEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]

    if (!data_.length) {
      return []
    }

    const serviceZoneIds = data_.map((s) => s.id)
    if (!serviceZoneIds.length) {
      return []
    }

    const serviceZones = await this.serviceZoneService_.list(
      {
        id: serviceZoneIds,
      },
      {
        relations: ["geo_zones"],
      },
      sharedContext
    )

    const serviceZoneSet = new Set(serviceZones.map((s) => s.id))
    const expectedServiceZoneSet = new Set(data_.map((s) => s.id))
    const missingServiceZoneIds = getSetDifference(
      expectedServiceZoneSet,
      serviceZoneSet
    )

    if (missingServiceZoneIds.size) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `The following service zones does not exists: ${Array.from(
          missingServiceZoneIds
        ).join(", ")}`
      )
    }

    const serviceZoneMap = new Map<string, TServiceZoneEntity>(
      serviceZones.map((s) => [s.id, s])
    )

    const serviceZoneIdsToDelete: string[] = []
    const geoZoneIdsToDelete: string[] = []

    data_.forEach((serviceZone) => {
      if (serviceZone.geo_zones) {
        const existingServiceZone = serviceZoneMap.get(serviceZone.id)!
        const existingGeoZones = existingServiceZone.geo_zones
        const updatedGeoZones = serviceZone.geo_zones
        const toDeleteGeoZoneIds = getSetDifference(
          new Set(existingGeoZones.map((g) => g.id)),
          new Set(
            updatedGeoZones
              .map((g) => "id" in g && g.id)
              .filter((id): id is string => !!id)
          )
        )
        if (toDeleteGeoZoneIds.size) {
          geoZoneIdsToDelete.push(...Array.from(toDeleteGeoZoneIds))
        }

        const geoZonesMap = new Map(
          existingServiceZone.geo_zones.map((geoZone) => [geoZone.id, geoZone])
        )
        const geoZonesSet = new Set(
          existingGeoZones
            .map((g) => "id" in g && g.id)
            .filter((id): id is string => !!id)
        )
        const expectedGeoZoneSet = new Set(
          serviceZone.geo_zones
            .map((g) => "id" in g && g.id)
            .filter((id): id is string => !!id)
        )
        const missingGeoZoneIds = getSetDifference(
          expectedGeoZoneSet,
          geoZonesSet
        )

        if (missingGeoZoneIds.size) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `The following geo zones does not exists: ${Array.from(
              missingGeoZoneIds
            ).join(", ")}`
          )
        }

        serviceZone.geo_zones = serviceZone.geo_zones.map((geoZone) => {
          if (!("id" in geoZone)) {
            return geoZone
          }
          return geoZonesMap.get(geoZone.id)!
        })
      }
    })

    if (geoZoneIdsToDelete.length) {
      await this.geoZoneService_.delete(
        {
          id: geoZoneIdsToDelete,
        },
        sharedContext
      )
    }

    const updatedServiceZones = await this.serviceZoneService_.update(
      data_,
      sharedContext
    )

    return Array.isArray(data) ? updatedServiceZones : updatedServiceZones[0]
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
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.ShippingOptionDTO[] | FulfillmentTypes.ShippingOptionDTO
  > {
    return []
  }

  updateGeoZones(
    data: FulfillmentTypes.UpdateGeoZoneDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.GeoZoneDTO[]>
  updateGeoZones(
    data: FulfillmentTypes.UpdateGeoZoneDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.GeoZoneDTO>

  @InjectManager("baseRepository_")
  async updateGeoZones(
    data:
      | FulfillmentTypes.UpdateGeoZoneDTO
      | FulfillmentTypes.UpdateGeoZoneDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<FulfillmentTypes.GeoZoneDTO | FulfillmentTypes.GeoZoneDTO[]> {
    const updatedGeoZones = await this.geoZoneService_.update(
      data,
      sharedContext
    )

    const serialized = await this.baseRepository_.serialize<
      FulfillmentTypes.GeoZoneDTO[]
    >(updatedGeoZones, {
      populate: true,
    })

    return Array.isArray(data) ? serialized : serialized[0]
  }
}
