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
  getSetDifference,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  promiseAll,
} from "@medusajs/utils"

import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import {
  FulfillmentSet,
  GeoZone,
  ServiceZone,
  ShippingOption,
  ShippingOptionRule,
  ShippingOptionType,
  ShippingProfile,
} from "@models"
import { validateRules } from "@utils"

const generateMethodForModels = [
  ServiceZone,
  ShippingOption,
  GeoZone,
  ShippingProfile,
  ShippingOptionRule,
  ShippingOptionType,
]

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  fulfillmentSetService: ModulesSdkTypes.InternalModuleService<any>
  serviceZoneService: ModulesSdkTypes.InternalModuleService<any>
  geoZoneService: ModulesSdkTypes.InternalModuleService<any>
  shippingProfileService: ModulesSdkTypes.InternalModuleService<any>
  shippingOptionService: ModulesSdkTypes.InternalModuleService<any>
  shippingOptionRuleService: ModulesSdkTypes.InternalModuleService<any>
  shippingOptionTypeService: ModulesSdkTypes.InternalModuleService<any>
}

export default class FulfillmentModuleService<
    TEntity extends FulfillmentSet = FulfillmentSet,
    TServiceZoneEntity extends ServiceZone = ServiceZone,
    TGeoZoneEntity extends GeoZone = GeoZone,
    TShippingProfileEntity extends ShippingProfile = ShippingProfile,
    TShippingOptionEntity extends ShippingOption = ShippingOption,
    TShippingOptionRuleEntity extends ShippingOptionRule = ShippingOptionRule,
    TSippingOptionTypeEntity extends ShippingOptionType = ShippingOptionType
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    FulfillmentTypes.FulfillmentSetDTO,
    {
      FulfillmentSet: { dto: FulfillmentTypes.FulfillmentSetDTO }
      ServiceZone: { dto: FulfillmentTypes.ServiceZoneDTO }
      ShippingOption: { dto: FulfillmentTypes.ShippingOptionDTO }
      GeoZone: { dto: FulfillmentTypes.GeoZoneDTO }
      ShippingProfile: { dto: FulfillmentTypes.ShippingProfileDTO }
      ShippingOptionRule: { dto: FulfillmentTypes.ShippingOptionRuleDTO }
      ShippingOptionType: { dto: FulfillmentTypes.ShippingOptionTypeDTO }
    }
  >(FulfillmentSet, generateMethodForModels, entityNameToLinkableKeysMap)
  implements IFulfillmentModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly fulfillmentSetService_: ModulesSdkTypes.InternalModuleService<TEntity>
  protected readonly serviceZoneService_: ModulesSdkTypes.InternalModuleService<TServiceZoneEntity>
  protected readonly geoZoneService_: ModulesSdkTypes.InternalModuleService<TGeoZoneEntity>
  protected readonly shippingProfileService_: ModulesSdkTypes.InternalModuleService<TShippingProfileEntity>
  protected readonly shippingOptionService_: ModulesSdkTypes.InternalModuleService<TShippingOptionEntity>
  protected readonly shippingOptionRuleService_: ModulesSdkTypes.InternalModuleService<TShippingOptionRuleEntity>
  protected readonly shippingOptionTypeService_: ModulesSdkTypes.InternalModuleService<TSippingOptionTypeEntity>

  constructor(
    {
      baseRepository,
      fulfillmentSetService,
      serviceZoneService,
      geoZoneService,
      shippingProfileService,
      shippingOptionService,
      shippingOptionRuleService,
      shippingOptionTypeService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.fulfillmentSetService_ = fulfillmentSetService
    this.serviceZoneService_ = serviceZoneService
    this.geoZoneService_ = geoZoneService
    this.shippingProfileService_ = shippingProfileService
    this.shippingOptionService_ = shippingOptionService
    this.shippingOptionRuleService_ = shippingOptionRuleService
    this.shippingOptionTypeService_ = shippingOptionTypeService
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

  @InjectManager("baseRepository_")
  async createShippingOptions(
    data:
      | FulfillmentTypes.CreateShippingOptionDTO[]
      | FulfillmentTypes.CreateShippingOptionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.ShippingOptionDTO | FulfillmentTypes.ShippingOptionDTO[]
  > {
    const createdShippingOptions = await this.createShippingOptions_(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      FulfillmentTypes.ShippingOptionDTO | FulfillmentTypes.ShippingOptionDTO[]
    >(createdShippingOptions, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  async createShippingOptions_(
    data:
      | FulfillmentTypes.CreateShippingOptionDTO[]
      | FulfillmentTypes.CreateShippingOptionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TShippingOptionEntity | TShippingOptionEntity[]> {
    let data_ = Array.isArray(data) ? data : [data]

    if (!data_.length) {
      return []
    }

    const rules = data_.flatMap((d) => d.rules)
    if (rules.length) {
      validateRules(rules as Record<string, unknown>[])
    }

    const createdShippingOptions = await this.shippingOptionService_.create(
      data_,
      sharedContext
    )

    return Array.isArray(data)
      ? createdShippingOptions
      : createdShippingOptions[0]
  }

  createShippingProfiles(
    data: FulfillmentTypes.CreateShippingProfileDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingProfileDTO[]>
  createShippingProfiles(
    data: FulfillmentTypes.CreateShippingProfileDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingProfileDTO>

  @InjectTransactionManager("baseRepository_")
  async createShippingProfiles(
    data:
      | FulfillmentTypes.CreateShippingProfileDTO[]
      | FulfillmentTypes.CreateShippingProfileDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.ShippingProfileDTO | FulfillmentTypes.ShippingProfileDTO[]
  > {
    const createdShippingProfiles = await this.createShippingProfiles_(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      | FulfillmentTypes.ShippingProfileDTO
      | FulfillmentTypes.ShippingProfileDTO[]
    >(createdShippingProfiles, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  async createShippingProfiles_(
    data:
      | FulfillmentTypes.CreateShippingProfileDTO[]
      | FulfillmentTypes.CreateShippingProfileDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TShippingProfileEntity[] | TShippingProfileEntity> {
    const data_ = Array.isArray(data) ? data : [data]

    if (!data_.length) {
      return []
    }

    const createdShippingProfiles = await this.shippingProfileService_.create(
      data_,
      sharedContext
    )

    return Array.isArray(data)
      ? createdShippingProfiles
      : createdShippingProfiles[0]
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

  async createShippingOptionRules(
    data: FulfillmentTypes.CreateShippingOptionRuleDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionRuleDTO[]>
  async createShippingOptionRules(
    data: FulfillmentTypes.CreateShippingOptionRuleDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionRuleDTO>

  @InjectManager("baseRepository_")
  async createShippingOptionRules(
    data:
      | FulfillmentTypes.CreateShippingOptionRuleDTO[]
      | FulfillmentTypes.CreateShippingOptionRuleDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    | FulfillmentTypes.ShippingOptionRuleDTO
    | FulfillmentTypes.ShippingOptionRuleDTO[]
  > {
    const createdShippingOptionRules = await this.createShippingOptionRules_(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      | FulfillmentTypes.ShippingOptionRuleDTO
      | FulfillmentTypes.ShippingOptionRuleDTO[]
    >(createdShippingOptionRules, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  async createShippingOptionRules_(
    data:
      | FulfillmentTypes.CreateShippingOptionRuleDTO[]
      | FulfillmentTypes.CreateShippingOptionRuleDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TShippingOptionRuleEntity | TShippingOptionRuleEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]

    if (!data_.length) {
      return []
    }

    validateRules(data_ as unknown as Record<string, unknown>[])

    const createdShippingOptionRules =
      await this.shippingOptionRuleService_.create(data_, sharedContext)

    return Array.isArray(data)
      ? createdShippingOptionRules
      : createdShippingOptionRules[0]
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

  @InjectManager("baseRepository_")
  async updateShippingOptions(
    data:
      | FulfillmentTypes.UpdateShippingOptionDTO[]
      | FulfillmentTypes.UpdateShippingOptionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.ShippingOptionDTO[] | FulfillmentTypes.ShippingOptionDTO
  > {
    const updatedShippingOptions = await this.updateShippingOptions_(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      FulfillmentTypes.ShippingOptionDTO | FulfillmentTypes.ShippingOptionDTO[]
    >(updatedShippingOptions, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  async updateShippingOptions_(
    data:
      | FulfillmentTypes.UpdateShippingOptionDTO[]
      | FulfillmentTypes.UpdateShippingOptionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TShippingOptionEntity | TShippingOptionEntity[]> {
    const dataArray = Array.isArray(data) ? data : [data]

    if (!dataArray.length) {
      return []
    }

    const shippingOptionIds = dataArray.map((s) => s.id)
    if (!shippingOptionIds.length) {
      return []
    }

    const shippingOptions = await this.shippingOptionService_.list(
      {
        id: shippingOptionIds,
      },
      {
        relations: ["rules"],
      },
      sharedContext
    )

    FulfillmentModuleService.validateMissingShippingOptions_(
      shippingOptions,
      dataArray
    )

    const ruleIdsToDelete: string[] = []
    dataArray.forEach((shippingOption) => {
      if (!shippingOption.rules) {
        return
      }

      const existingShippingOption = shippingOptions.find(
        (s) => s.id === shippingOption.id
      )!
      const existingRules = existingShippingOption.rules

      FulfillmentModuleService.validateMissingShippingOptionRules(
        existingShippingOption,
        shippingOption
      )

      const existingRulesMap = new Map(
        existingRules.map((rule) => [rule.id, rule])
      )
      const updatedRules = shippingOption.rules
      const toDeleteRuleIds = getSetDifference(
        new Set(existingRules.map((r) => r.id)),
        new Set(
          updatedRules
            .map((r) => "id" in r && r.id)
            .filter((id): id is string => !!id)
        )
      )
      if (toDeleteRuleIds.size) {
        ruleIdsToDelete.push(...Array.from(toDeleteRuleIds))
      }

      const newRules = updatedRules
        .map((rule) => {
          if (!("id" in rule)) {
            return rule
          }
          return
        })
        .filter(Boolean)

      validateRules(newRules as Record<string, unknown>[])

      shippingOption.rules = shippingOption.rules.map((rule) => {
        if (!("id" in rule)) {
          return rule
        }
        return existingRulesMap.get(rule.id)!
      })
    })

    if (ruleIdsToDelete.length) {
      await this.shippingOptionRuleService_.delete(
        ruleIdsToDelete,
        sharedContext
      )
    }

    const updatedShippingOptions = await this.shippingOptionService_.update(
      dataArray,
      sharedContext
    )

    return Array.isArray(data)
      ? updatedShippingOptions
      : updatedShippingOptions[0]
  }

  updateShippingProfiles(
    data: FulfillmentTypes.UpdateShippingProfileDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingProfileDTO[]>
  updateShippingProfiles(
    data: FulfillmentTypes.UpdateShippingProfileDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingProfileDTO>

  @InjectTransactionManager("baseRepository_")
  async updateShippingProfiles(
    data:
      | FulfillmentTypes.UpdateShippingProfileDTO
      | FulfillmentTypes.UpdateShippingProfileDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.ShippingProfileDTO | FulfillmentTypes.ShippingProfileDTO[]
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

  updateShippingOptionRules(
    data: FulfillmentTypes.UpdateShippingOptionRuleDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionRuleDTO[]>
  updateShippingOptionRules(
    data: FulfillmentTypes.UpdateShippingOptionRuleDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionRuleDTO>

  @InjectManager("baseRepository_")
  async updateShippingOptionRules(
    data:
      | FulfillmentTypes.UpdateShippingOptionRuleDTO[]
      | FulfillmentTypes.UpdateShippingOptionRuleDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    | FulfillmentTypes.ShippingOptionRuleDTO[]
    | FulfillmentTypes.ShippingOptionRuleDTO
  > {
    const updatedShippingOptionRules = await this.updateShippingOptionRules_(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      | FulfillmentTypes.ShippingOptionRuleDTO
      | FulfillmentTypes.ShippingOptionRuleDTO[]
    >(updatedShippingOptionRules, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  async updateShippingOptionRules_(
    data:
      | FulfillmentTypes.UpdateShippingOptionRuleDTO[]
      | FulfillmentTypes.UpdateShippingOptionRuleDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TShippingOptionRuleEntity | TShippingOptionRuleEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]

    if (!data_.length) {
      return []
    }

    validateRules(data_ as unknown as Record<string, unknown>[])

    const updatedShippingOptionRules =
      await this.shippingOptionRuleService_.update(data_, sharedContext)

    return Array.isArray(data)
      ? updatedShippingOptionRules
      : updatedShippingOptionRules[0]
  }

  protected static validateMissingShippingOptions_(
    shippingOptions: ShippingOption[],
    shippingOptionsData: FulfillmentTypes.UpdateShippingOptionDTO[]
  ) {
    const shippingOptionSet = new Set(shippingOptions.map((s) => s.id))
    const expectedShippingOptionSet = new Set(
      shippingOptionsData.map((s) => s.id)
    )
    const missingShippingOptionIds = getSetDifference(
      expectedShippingOptionSet,
      shippingOptionSet
    )

    if (missingShippingOptionIds.size) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `The following shipping options do not exist: ${Array.from(
          missingShippingOptionIds
        ).join(", ")}`
      )
    }
  }

  protected static validateMissingShippingOptionRules(
    shippingOption: ShippingOption,
    shippingOptionUpdateData: FulfillmentTypes.UpdateShippingOptionDTO
  ) {
    if (!shippingOptionUpdateData.rules) {
      return
    }

    const existingRules = shippingOption.rules

    const rulesSet = new Set(existingRules.map((r) => r.id))
    // Only validate the rules that have an id to validate that they really exists in the shipping option
    const expectedRuleSet = new Set(
      shippingOptionUpdateData.rules
        .map((r) => "id" in r && r.id)
        .filter((id): id is string => !!id)
    )
    const nonAlreadyExistingRules = getSetDifference(expectedRuleSet, rulesSet)

    if (nonAlreadyExistingRules.size) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `The following rules does not exists: ${Array.from(
          nonAlreadyExistingRules
        ).join(", ")} on shipping option ${shippingOptionUpdateData.id}`
      )
    }
  }
}
