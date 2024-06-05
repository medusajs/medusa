import {
  Context,
  DAL,
  FilterableFulfillmentSetProps,
  FindConfig,
  FulfillmentDTO,
  FulfillmentTypes,
  IFulfillmentModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  ShippingOptionDTO,
  UpdateFulfillmentSetDTO,
  UpdateServiceZoneDTO,
} from "@medusajs/types"
import {
  EmitEvents,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  arrayDifference,
  deepEqualObj,
  getSetDifference,
  isDefined,
  isPresent,
  isString,
  promiseAll,
} from "@medusajs/utils"
import {
  Fulfillment,
  FulfillmentProvider,
  FulfillmentSet,
  GeoZone,
  ServiceZone,
  ShippingOption,
  ShippingOptionRule,
  ShippingOptionType,
  ShippingProfile,
} from "@models"
import {
  buildCreatedFulfillmentEvents,
  buildCreatedFulfillmentSetEvents,
  buildCreatedServiceZoneEvents,
  eventBuilders,
  isContextValid,
  validateAndNormalizeRules,
} from "@utils"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import { UpdateShippingOptionsInput } from "../types/service"
import { buildCreatedShippingOptionEvents } from "../utils/events"
import FulfillmentProviderService from "./fulfillment-provider"

const generateMethodForModels = [
  ServiceZone,
  ShippingOption,
  GeoZone,
  ShippingProfile,
  ShippingOptionRule,
  ShippingOptionType,
  FulfillmentProvider,
  // Not adding Fulfillment to not auto generate the methods under the hood and only provide the methods we want to expose8
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
  fulfillmentProviderService: FulfillmentProviderService
  fulfillmentService: ModulesSdkTypes.InternalModuleService<any>
}

export default class FulfillmentModuleService<
    TEntity extends FulfillmentSet = FulfillmentSet,
    TServiceZoneEntity extends ServiceZone = ServiceZone,
    TGeoZoneEntity extends GeoZone = GeoZone,
    TShippingProfileEntity extends ShippingProfile = ShippingProfile,
    TShippingOptionEntity extends ShippingOption = ShippingOption,
    TShippingOptionRuleEntity extends ShippingOptionRule = ShippingOptionRule,
    TSippingOptionTypeEntity extends ShippingOptionType = ShippingOptionType,
    TFulfillmentEntity extends Fulfillment = Fulfillment
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
      FulfillmentProvider: { dto: FulfillmentTypes.FulfillmentProviderDTO }
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
  protected readonly fulfillmentProviderService_: FulfillmentProviderService
  protected readonly fulfillmentService_: ModulesSdkTypes.InternalModuleService<TFulfillmentEntity>

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
      fulfillmentProviderService,
      fulfillmentService,
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
    this.fulfillmentProviderService_ = fulfillmentProviderService
    this.fulfillmentService_ = fulfillmentService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  @InjectManager("baseRepository_")
  // @ts-ignore
  async listShippingOptions(
    filters: FulfillmentTypes.FilterableShippingOptionForContextProps = {},
    config: FindConfig<FulfillmentTypes.ShippingOptionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<FulfillmentTypes.ShippingOptionDTO[]> {
    // Eventually, we could call normalizeListShippingOptionsForContextParams to translate the address and make a and condition with the other filters
    // In that case we could remote the address check below
    if (filters?.context || filters?.address) {
      return await this.listShippingOptionsForContext(
        filters,
        config,
        sharedContext
      )
    }

    return await super.listShippingOptions(filters, config, sharedContext)
  }

  @InjectManager("baseRepository_")
  async listShippingOptionsForContext(
    filters: FulfillmentTypes.FilterableShippingOptionForContextProps,
    config: FindConfig<ShippingOptionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<FulfillmentTypes.ShippingOptionDTO[]> {
    const {
      context,
      config: normalizedConfig,
      filters: normalizedFilters,
    } = FulfillmentModuleService.normalizeListShippingOptionsForContextParams(
      filters,
      config
    )

    let shippingOptions = await this.shippingOptionService_.list(
      normalizedFilters,
      normalizedConfig,
      sharedContext
    )

    if (context) {
      shippingOptions = shippingOptions.filter((shippingOption) => {
        if (!shippingOption.rules?.length) {
          return true
        }

        return isContextValid(
          context,
          shippingOption.rules.map((r) => r)
        )
      })
    }

    return await this.baseRepository_.serialize<
      FulfillmentTypes.ShippingOptionDTO[]
    >(shippingOptions)
  }

  @InjectManager("baseRepository_")
  async retrieveFulfillment(
    id: string,
    config: FindConfig<FulfillmentTypes.FulfillmentDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<FulfillmentTypes.FulfillmentDTO> {
    const fulfillment = await this.fulfillmentService_.retrieve(
      id,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<FulfillmentTypes.FulfillmentDTO>(
      fulfillment
    )
  }

  @InjectManager("baseRepository_")
  async listFulfillments(
    filters: FulfillmentTypes.FilterableFulfillmentProps = {},
    config: FindConfig<FulfillmentTypes.FulfillmentDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<FulfillmentTypes.FulfillmentDTO[]> {
    const fulfillments = await this.fulfillmentService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      FulfillmentTypes.FulfillmentDTO[]
    >(fulfillments)
  }

  @InjectManager("baseRepository_")
  async listAndCountFulfillments(
    filters?: FilterableFulfillmentSetProps,
    config?: FindConfig<FulfillmentDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[FulfillmentDTO[], number]> {
    const [fulfillments, count] = await this.fulfillmentService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<FulfillmentTypes.FulfillmentDTO[]>(
        fulfillments
      ),
      count,
    ]
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
  @EmitEvents()
  async create(
    data:
      | FulfillmentTypes.CreateFulfillmentSetDTO
      | FulfillmentTypes.CreateFulfillmentSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.FulfillmentSetDTO | FulfillmentTypes.FulfillmentSetDTO[]
  > {
    const createdFulfillmentSets = await this.create_(data, sharedContext)

    const returnedFulfillmentSets = Array.isArray(data)
      ? createdFulfillmentSets
      : createdFulfillmentSets[0]

    return await this.baseRepository_.serialize<
      FulfillmentTypes.FulfillmentSetDTO | FulfillmentTypes.FulfillmentSetDTO[]
    >(returnedFulfillmentSets)
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data:
      | FulfillmentTypes.CreateFulfillmentSetDTO
      | FulfillmentTypes.CreateFulfillmentSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]

    if (!data_.length) {
      return []
    }

    for (const fulfillmentSet of data_) {
      if (fulfillmentSet.service_zones?.length) {
        for (const serviceZone of fulfillmentSet.service_zones) {
          if (serviceZone.geo_zones?.length) {
            FulfillmentModuleService.validateGeoZones(serviceZone.geo_zones)
          }
        }
      }
    }

    const createdFulfillmentSets = await this.fulfillmentSetService_.create(
      data_,
      sharedContext
    )

    buildCreatedFulfillmentSetEvents({
      fulfillmentSets: createdFulfillmentSets,
      sharedContext,
    })

    return createdFulfillmentSets
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
  @EmitEvents()
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
    >(Array.isArray(data) ? createdServiceZones : createdServiceZones[0])
  }

  @InjectTransactionManager("baseRepository_")
  protected async createServiceZones_(
    data:
      | FulfillmentTypes.CreateServiceZoneDTO[]
      | FulfillmentTypes.CreateServiceZoneDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TServiceZoneEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]

    if (!data_.length) {
      return []
    }

    for (const serviceZone of data_) {
      if (serviceZone.geo_zones?.length) {
        if (serviceZone.geo_zones?.length) {
          FulfillmentModuleService.validateGeoZones(serviceZone.geo_zones)
        }
      }
    }

    const createdServiceZones = await this.serviceZoneService_.create(
      data_,
      sharedContext
    )

    buildCreatedServiceZoneEvents({
      serviceZones: createdServiceZones,
      sharedContext,
    })

    return createdServiceZones
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
  @EmitEvents()
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
    >(Array.isArray(data) ? createdShippingOptions : createdShippingOptions[0])
  }

  @InjectTransactionManager("baseRepository_")
  async createShippingOptions_(
    data:
      | FulfillmentTypes.CreateShippingOptionDTO[]
      | FulfillmentTypes.CreateShippingOptionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TShippingOptionEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]

    if (!data_.length) {
      return []
    }

    const rules = data_.flatMap((d) => d.rules).filter(Boolean)
    if (rules.length) {
      validateAndNormalizeRules(rules as Record<string, unknown>[])
    }

    const createdSO = await this.shippingOptionService_.create(
      data_,
      sharedContext
    )

    buildCreatedShippingOptionEvents({
      shippingOptions: createdSO,
      sharedContext,
    })

    return createdSO
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
  @EmitEvents()
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

    eventBuilders.createdShippingProfile({
      data: createdShippingProfiles,
      sharedContext,
    })

    return await this.baseRepository_.serialize<
      | FulfillmentTypes.ShippingProfileDTO
      | FulfillmentTypes.ShippingProfileDTO[]
    >(
      Array.isArray(data) ? createdShippingProfiles : createdShippingProfiles[0]
    )
  }

  @InjectTransactionManager("baseRepository_")
  async createShippingProfiles_(
    data:
      | FulfillmentTypes.CreateShippingProfileDTO[]
      | FulfillmentTypes.CreateShippingProfileDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TShippingProfileEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]

    if (!data_.length) {
      return []
    }

    return await this.shippingProfileService_.create(data_, sharedContext)
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
  @EmitEvents()
  async createGeoZones(
    data:
      | FulfillmentTypes.CreateGeoZoneDTO
      | FulfillmentTypes.CreateGeoZoneDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<FulfillmentTypes.GeoZoneDTO | FulfillmentTypes.GeoZoneDTO[]> {
    const data_ = Array.isArray(data) ? data : [data]

    FulfillmentModuleService.validateGeoZones(data_)

    const createdGeoZones = await this.geoZoneService_.create(
      data_,
      sharedContext
    )

    eventBuilders.createdGeoZone({
      data: createdGeoZones,
      sharedContext,
    })

    return await this.baseRepository_.serialize<FulfillmentTypes.GeoZoneDTO[]>(
      Array.isArray(data) ? createdGeoZones : createdGeoZones[0]
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
  @EmitEvents()
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
    >(
      Array.isArray(data)
        ? createdShippingOptionRules
        : createdShippingOptionRules[0]
    )
  }

  @InjectTransactionManager("baseRepository_")
  async createShippingOptionRules_(
    data:
      | FulfillmentTypes.CreateShippingOptionRuleDTO[]
      | FulfillmentTypes.CreateShippingOptionRuleDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TShippingOptionRuleEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]

    if (!data_.length) {
      return []
    }

    validateAndNormalizeRules(data_ as unknown as Record<string, unknown>[])

    const createdSORules = await this.shippingOptionRuleService_.create(
      data_,
      sharedContext
    )

    eventBuilders.createdShippingOptionRule({
      data: createdSORules.map((sor) => ({ id: sor.id })),
      sharedContext,
    })

    return createdSORules
  }

  @InjectManager("baseRepository_")
  @EmitEvents()
  async createFulfillment(
    data: FulfillmentTypes.CreateFulfillmentDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<FulfillmentTypes.FulfillmentDTO> {
    const { order, ...fulfillmentDataToCreate } = data

    const fulfillment = await this.fulfillmentService_.create(
      fulfillmentDataToCreate,
      sharedContext
    )

    const {
      items,
      data: fulfillmentData,
      provider_id,
      ...fulfillmentRest
    } = fulfillment

    let fulfillmentThirdPartyData!: any
    try {
      fulfillmentThirdPartyData =
        await this.fulfillmentProviderService_.createFulfillment(
          provider_id,
          fulfillmentData || {},
          items.map((i) => i),
          order,
          fulfillmentRest
        )
      await this.fulfillmentService_.update(
        {
          id: fulfillment.id,
          data: fulfillmentThirdPartyData ?? {},
        },
        sharedContext
      )
    } catch (error) {
      await this.fulfillmentService_.delete(fulfillment.id, sharedContext)
      throw error
    }

    buildCreatedFulfillmentEvents({
      fulfillments: [fulfillment],
      sharedContext,
    })

    return await this.baseRepository_.serialize<FulfillmentTypes.FulfillmentDTO>(
      fulfillment
    )
  }

  @InjectManager("baseRepository_")
  @EmitEvents()
  async createReturnFulfillment(
    data: FulfillmentTypes.CreateFulfillmentDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<FulfillmentTypes.FulfillmentDTO> {
    const { order, ...fulfillmentDataToCreate } = data

    const fulfillment = await this.fulfillmentService_.create(
      fulfillmentDataToCreate,
      sharedContext
    )

    let fulfillmentThirdPartyData!: any
    try {
      fulfillmentThirdPartyData =
        await this.fulfillmentProviderService_.createReturn(
          fulfillment.provider_id,
          fulfillment as Record<any, any>
        )
      await this.fulfillmentService_.update(
        {
          id: fulfillment.id,
          data: fulfillmentThirdPartyData ?? {},
        },
        sharedContext
      )
    } catch (error) {
      await this.fulfillmentService_.delete(fulfillment.id, sharedContext)
      throw error
    }

    buildCreatedFulfillmentEvents({
      fulfillments: [fulfillment],
      sharedContext,
    })

    return await this.baseRepository_.serialize<FulfillmentTypes.FulfillmentDTO>(
      fulfillment
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
  @EmitEvents()
  async update(
    data: UpdateFulfillmentSetDTO[] | UpdateFulfillmentSetDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.FulfillmentSetDTO[] | FulfillmentTypes.FulfillmentSetDTO
  > {
    const updatedFulfillmentSets = await this.update_(data, sharedContext)

    return await this.baseRepository_.serialize<
      FulfillmentTypes.FulfillmentSetDTO | FulfillmentTypes.FulfillmentSetDTO[]
    >(updatedFulfillmentSets)
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
        take: fulfillmentSetIds.length,
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

    const serviceZoneIdsToDelete: string[] = []
    const geoZoneIdsToDelete: string[] = []
    const existingServiceZoneIds: string[] = []
    const existingGeoZoneIds: string[] = []

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
                if (serviceZone.geo_zones?.length) {
                  FulfillmentModuleService.validateGeoZones(
                    serviceZone.geo_zones
                  )
                }
                return serviceZone
              }

              const existingServiceZone = serviceZonesMap.get(serviceZone.id)!
              existingServiceZoneIds.push(existingServiceZone.id)

              if (existingServiceZone.geo_zones.length) {
                existingGeoZoneIds.push(
                  ...existingServiceZone.geo_zones.map((g) => g.id)
                )
              }

              return serviceZonesMap.get(serviceZone.id)!
            }
          )
        }
      }
    })

    if (serviceZoneIdsToDelete.length) {
      eventBuilders.deletedServiceZone({
        data: serviceZoneIdsToDelete.map((id) => ({ id })),
        sharedContext,
      })
      eventBuilders.deletedGeoZone({
        data: geoZoneIdsToDelete.map((id) => ({ id })),
        sharedContext,
      })

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

    eventBuilders.updatedFulfillmentSet({
      data: updatedFulfillmentSets,
      sharedContext,
    })

    const createdServiceZoneIds: string[] = []
    const createdGeoZoneIds = updatedFulfillmentSets
      .flatMap((f) =>
        [...f.service_zones].flatMap((serviceZone) => {
          if (!existingServiceZoneIds.includes(serviceZone.id)) {
            createdServiceZoneIds.push(serviceZone.id)
          }
          return serviceZone.geo_zones.map((g) => g.id)
        })
      )
      .filter((id) => !existingGeoZoneIds.includes(id))

    eventBuilders.createdServiceZone({
      data: createdServiceZoneIds.map((id) => ({ id })),
      sharedContext,
    })
    eventBuilders.createdGeoZone({
      data: createdGeoZoneIds.map((id) => ({ id })),
      sharedContext,
    })

    return Array.isArray(data)
      ? updatedFulfillmentSets
      : updatedFulfillmentSets[0]
  }

  updateServiceZones(
    id: string,
    data: FulfillmentTypes.UpdateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO>
  updateServiceZones(
    selector: FulfillmentTypes.FilterableServiceZoneProps,
    data: FulfillmentTypes.UpdateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO[]>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async updateServiceZones(
    idOrSelector: string | FulfillmentTypes.FilterableServiceZoneProps,
    data: FulfillmentTypes.UpdateServiceZoneDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.ServiceZoneDTO[] | FulfillmentTypes.ServiceZoneDTO
  > {
    const normalizedInput: UpdateServiceZoneDTO[] = []

    if (isString(idOrSelector)) {
      normalizedInput.push({ id: idOrSelector, ...data })
    } else {
      const serviceZones = await this.serviceZoneService_.list(
        { ...idOrSelector },
        {},
        sharedContext
      )

      if (!serviceZones.length) {
        return []
      }

      for (const serviceZone of serviceZones) {
        normalizedInput.push({ id: serviceZone.id, ...data })
      }
    }

    const updatedServiceZones = await this.updateServiceZones_(
      normalizedInput,
      sharedContext
    )

    const toReturn = isString(idOrSelector)
      ? updatedServiceZones[0]
      : updatedServiceZones

    return await this.baseRepository_.serialize<
      FulfillmentTypes.ServiceZoneDTO | FulfillmentTypes.ServiceZoneDTO[]
    >(toReturn)
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
        take: serviceZoneIds.length,
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
    const existingGeoZoneIds: string[] = []
    const updatedGeoZoneIds: string[] = []

    data_.forEach((serviceZone) => {
      if (serviceZone.geo_zones) {
        const existingServiceZone = serviceZoneMap.get(serviceZone.id!)!
        const existingGeoZones = existingServiceZone.geo_zones
        const updatedGeoZones = serviceZone.geo_zones
        const existingGeoZoneIdsForServiceZone = existingGeoZones.map(
          (g) => g.id
        )
        const toDeleteGeoZoneIds = getSetDifference(
          new Set(existingGeoZoneIdsForServiceZone),
          new Set(
            updatedGeoZones
              .map((g) => "id" in g && g.id)
              .filter((id): id is string => !!id)
          )
        )

        existingGeoZoneIds.push(...existingGeoZoneIdsForServiceZone)

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
            FulfillmentModuleService.validateGeoZones([geoZone])
            return geoZone
          }
          const existing = geoZonesMap.get(geoZone.id)!

          // If only the id is provided we dont consider it as an update
          if (
            Object.keys(geoZone).length > 1 &&
            !deepEqualObj(existing, geoZone)
          ) {
            updatedGeoZoneIds.push(geoZone.id)
          }

          return { ...existing, ...geoZone }
        })
      }
    })

    if (geoZoneIdsToDelete.length) {
      eventBuilders.deletedGeoZone({
        data: geoZoneIdsToDelete.map((id) => ({ id })),
        sharedContext,
      })

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

    eventBuilders.updatedServiceZone({
      data: updatedServiceZones,
      sharedContext,
    })

    const createdGeoZoneIds = updatedServiceZones
      .flatMap((serviceZone) => {
        return serviceZone.geo_zones.map((g) => g.id)
      })
      .filter((id) => !existingGeoZoneIds.includes(id))

    eventBuilders.createdGeoZone({
      data: createdGeoZoneIds.map((id) => ({ id })),
      sharedContext,
    })
    eventBuilders.updatedGeoZone({
      data: updatedGeoZoneIds.map((id) => ({ id })),
      sharedContext,
    })

    return Array.isArray(data) ? updatedServiceZones : updatedServiceZones[0]
  }

  upsertServiceZones(
    data: FulfillmentTypes.UpsertServiceZoneDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO>
  upsertServiceZones(
    data: FulfillmentTypes.UpsertServiceZoneDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO[]>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async upsertServiceZones(
    data:
      | FulfillmentTypes.UpsertServiceZoneDTO
      | FulfillmentTypes.UpsertServiceZoneDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.ServiceZoneDTO | FulfillmentTypes.ServiceZoneDTO[]
  > {
    const upsertServiceZones = await this.upsertServiceZones_(
      data,
      sharedContext
    )

    const allServiceZones = await this.baseRepository_.serialize<
      FulfillmentTypes.ServiceZoneDTO[] | FulfillmentTypes.ServiceZoneDTO
    >(upsertServiceZones)

    return Array.isArray(data) ? allServiceZones : allServiceZones[0]
  }

  @InjectTransactionManager("baseRepository_")
  async upsertServiceZones_(
    data:
      | FulfillmentTypes.UpsertServiceZoneDTO[]
      | FulfillmentTypes.UpsertServiceZoneDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TServiceZoneEntity[] | TServiceZoneEntity> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (serviceZone): serviceZone is FulfillmentTypes.UpdateServiceZoneDTO =>
        !!serviceZone.id
    )
    const forCreate = input.filter(
      (serviceZone): serviceZone is FulfillmentTypes.CreateServiceZoneDTO =>
        !serviceZone.id
    )

    const created: TServiceZoneEntity[] = []
    const updated: TServiceZoneEntity[] = []

    if (forCreate.length) {
      const createdServiceZones = await this.createServiceZones_(
        forCreate,
        sharedContext
      )

      const toPush = Array.isArray(createdServiceZones)
        ? createdServiceZones
        : [createdServiceZones]

      created.push(...toPush)
    }

    if (forUpdate.length) {
      const updatedServiceZones = await this.updateServiceZones_(
        forUpdate,
        sharedContext
      )

      const toPush = Array.isArray(updatedServiceZones)
        ? updatedServiceZones
        : [updatedServiceZones]

      updated.push(...toPush)
    }

    return [...created, ...updated]
  }

  updateShippingOptions(
    id: string,
    data: FulfillmentTypes.UpdateShippingOptionDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionDTO>
  updateShippingOptions(
    selector: FulfillmentTypes.FilterableShippingOptionProps,
    data: FulfillmentTypes.UpdateShippingOptionDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionDTO[]>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async updateShippingOptions(
    idOrSelector: string | FulfillmentTypes.FilterableShippingOptionProps,
    data: FulfillmentTypes.UpdateShippingOptionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.ShippingOptionDTO[] | FulfillmentTypes.ShippingOptionDTO
  > {
    const normalizedInput: UpdateShippingOptionsInput[] = []

    if (isString(idOrSelector)) {
      normalizedInput.push({ id: idOrSelector, ...data })
    } else {
      const shippingOptions = await this.shippingOptionService_.list(
        idOrSelector,
        {},
        sharedContext
      )
      shippingOptions.forEach((shippingOption) => {
        normalizedInput.push({ id: shippingOption.id, ...data })
      })
    }

    const updatedShippingOptions = await this.updateShippingOptions_(
      normalizedInput,
      sharedContext
    )

    const serialized = await this.baseRepository_.serialize<
      FulfillmentTypes.ShippingOptionDTO | FulfillmentTypes.ShippingOptionDTO[]
    >(updatedShippingOptions)

    return isString(idOrSelector) ? serialized[0] : serialized
  }

  @InjectTransactionManager("baseRepository_")
  async updateShippingOptions_(
    data: UpdateShippingOptionsInput[] | UpdateShippingOptionsInput,
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
        relations: ["rules", "type"],
        take: shippingOptionIds.length,
      },
      sharedContext
    )
    const existingShippingOptions = new Map(
      shippingOptions.map((s) => [s.id, s])
    )

    FulfillmentModuleService.validateMissingShippingOptions_(
      shippingOptions,
      dataArray
    )

    const ruleIdsToDelete: string[] = []
    const updatedRuleIds: string[] = []
    const existingRuleIds: string[] = []

    const optionTypeDeletedIds: string[] = []

    dataArray.forEach((shippingOption) => {
      const existingShippingOption = existingShippingOptions.get(
        shippingOption.id
      )! // Garuantueed to exist since the validation above have been performed

      if (shippingOption.type && !("id" in shippingOption.type)) {
        optionTypeDeletedIds.push(existingShippingOption.type.id)
      }

      if (!shippingOption.rules) {
        return
      }

      const existingRules = existingShippingOption.rules

      existingRuleIds.push(...existingRules.map((r) => r.id))

      FulfillmentModuleService.validateMissingShippingOptionRules(
        existingShippingOption,
        shippingOption
      )

      const existingRulesMap: Map<
        string,
        FulfillmentTypes.UpdateShippingOptionRuleDTO | ShippingOptionRule
      > = new Map(existingRules.map((rule) => [rule.id, rule]))

      const updatedRules = shippingOption.rules
        .map((rule) => {
          if ("id" in rule) {
            const existingRule = (existingRulesMap.get(rule.id) ??
              {}) as FulfillmentTypes.UpdateShippingOptionRuleDTO

            if (existingRulesMap.get(rule.id)) {
              updatedRuleIds.push(rule.id)
            }

            const ruleData: FulfillmentTypes.UpdateShippingOptionRuleDTO = {
              ...existingRule,
              ...rule,
            }

            existingRulesMap.set(rule.id, ruleData)
            return ruleData
          }

          return
        })
        .filter(Boolean) as FulfillmentTypes.UpdateShippingOptionRuleDTO[]

      validateAndNormalizeRules(updatedRules)

      const toDeleteRuleIds = arrayDifference(
        updatedRuleIds,
        Array.from(existingRulesMap.keys())
      ) as string[]

      if (toDeleteRuleIds.length) {
        ruleIdsToDelete.push(...toDeleteRuleIds)
      }

      shippingOption.rules = shippingOption.rules.map((rule) => {
        if (!("id" in rule)) {
          validateAndNormalizeRules([rule])
          return rule
        }
        return existingRulesMap.get(rule.id)!
      })
    })

    if (ruleIdsToDelete.length) {
      eventBuilders.deletedShippingOptionRule({
        data: ruleIdsToDelete.map((id) => ({ id })),
        sharedContext,
      })

      await this.shippingOptionRuleService_.delete(
        ruleIdsToDelete,
        sharedContext
      )
    }

    const updatedShippingOptions = await this.shippingOptionService_.update(
      dataArray,
      sharedContext
    )

    this.handleShippingOptionUpdateEvents({
      shippingOptionsData: dataArray,
      updatedShippingOptions,
      optionTypeDeletedIds,
      updatedRuleIds,
      existingRuleIds,
      sharedContext,
    })

    return Array.isArray(data)
      ? updatedShippingOptions
      : updatedShippingOptions[0]
  }

  private handleShippingOptionUpdateEvents({
    shippingOptionsData,
    updatedShippingOptions,
    optionTypeDeletedIds,
    updatedRuleIds,
    existingRuleIds,
    sharedContext,
  }) {
    eventBuilders.updatedShippingOption({
      data: updatedShippingOptions,
      sharedContext,
    })
    eventBuilders.deletedShippingOptionType({
      data: optionTypeDeletedIds.map((id) => ({ id })),
      sharedContext,
    })

    const createdOptionTypeIds = updatedShippingOptions
      .filter((so) => {
        const updateData = shippingOptionsData.find((sod) => sod.id === so.id)
        return updateData?.type && !("id" in updateData.type)
      })
      .map((so) => so.type.id)

    eventBuilders.createdShippingOptionType({
      data: createdOptionTypeIds.map((id) => ({ id })),
      sharedContext,
    })

    const createdRuleIds = updatedShippingOptions
      .flatMap((so) =>
        [...so.rules].map((rule) => {
          if (existingRuleIds.includes(rule.id)) {
            return
          }

          return rule.id
        })
      )
      .filter((id): id is string => !!id)

    eventBuilders.createdShippingOptionRule({
      data: createdRuleIds.map((id) => ({ id })),
      sharedContext,
    })
    eventBuilders.updatedShippingOptionRule({
      data: updatedRuleIds.map((id) => ({ id })),
      sharedContext,
    })
  }

  async upsertShippingOptions(
    data: FulfillmentTypes.UpsertShippingOptionDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionDTO[]>
  async upsertShippingOptions(
    data: FulfillmentTypes.UpsertShippingOptionDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionDTO>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async upsertShippingOptions(
    data:
      | FulfillmentTypes.UpsertShippingOptionDTO[]
      | FulfillmentTypes.UpsertShippingOptionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.ShippingOptionDTO[] | FulfillmentTypes.ShippingOptionDTO
  > {
    const upsertedShippingOptions = await this.upsertShippingOptions_(
      data,
      sharedContext
    )

    const allShippingOptions = await this.baseRepository_.serialize<
      FulfillmentTypes.ShippingOptionDTO[] | FulfillmentTypes.ShippingOptionDTO
    >(upsertedShippingOptions)

    return Array.isArray(data) ? allShippingOptions : allShippingOptions[0]
  }

  @InjectTransactionManager("baseRepository_")
  async upsertShippingOptions_(
    data:
      | FulfillmentTypes.UpsertShippingOptionDTO[]
      | FulfillmentTypes.UpsertShippingOptionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TShippingOptionEntity[] | TShippingOptionEntity> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (shippingOption): shippingOption is UpdateShippingOptionsInput =>
        !!shippingOption.id
    )
    const forCreate = input.filter(
      (
        shippingOption
      ): shippingOption is FulfillmentTypes.CreateShippingOptionDTO =>
        !shippingOption.id
    )

    let created: TShippingOptionEntity[] = []
    let updated: TShippingOptionEntity[] = []

    if (forCreate.length) {
      const createdShippingOptions = await this.createShippingOptions_(
        forCreate,
        sharedContext
      )
      const toPush = Array.isArray(createdShippingOptions)
        ? createdShippingOptions
        : [createdShippingOptions]
      created.push(...toPush)
    }
    if (forUpdate.length) {
      const updatedShippingOptions = await this.updateShippingOptions_(
        forUpdate,
        sharedContext
      )
      const toPush = Array.isArray(updatedShippingOptions)
        ? updatedShippingOptions
        : [updatedShippingOptions]
      updated.push(...toPush)
    }

    return [...created, ...updated]
  }

  updateShippingProfiles(
    selector: FulfillmentTypes.FilterableShippingProfileProps,
    data: FulfillmentTypes.UpdateShippingProfileDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingProfileDTO[]>
  updateShippingProfiles(
    id: string,
    data: FulfillmentTypes.UpdateShippingProfileDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingProfileDTO>

  @InjectTransactionManager("baseRepository_")
  async updateShippingProfiles(
    idOrSelector: string | FulfillmentTypes.FilterableShippingProfileProps,
    data: FulfillmentTypes.UpdateShippingProfileDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.ShippingProfileDTO | FulfillmentTypes.ShippingProfileDTO[]
  > {
    let normalizedInput: ({
      id: string
    } & FulfillmentTypes.UpdateShippingProfileDTO)[] = []
    if (isString(idOrSelector)) {
      await this.shippingProfileService_.retrieve(
        idOrSelector,
        {},
        sharedContext
      )
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      const profiles = await this.shippingProfileService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = profiles.map((profile) => ({
        id: profile.id,
        ...data,
      }))
    }

    const profiles = await this.shippingProfileService_.update(
      normalizedInput,
      sharedContext
    )

    const updatedProfiles = await this.baseRepository_.serialize<
      FulfillmentTypes.ShippingProfileDTO[]
    >(profiles)

    return isString(idOrSelector) ? updatedProfiles[0] : updatedProfiles
  }

  async upsertShippingProfiles(
    data: FulfillmentTypes.UpsertShippingProfileDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingProfileDTO[]>
  async upsertShippingProfiles(
    data: FulfillmentTypes.UpsertShippingProfileDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingProfileDTO>

  @InjectTransactionManager("baseRepository_")
  async upsertShippingProfiles(
    data:
      | FulfillmentTypes.UpsertShippingProfileDTO[]
      | FulfillmentTypes.UpsertShippingProfileDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.ShippingProfileDTO[] | FulfillmentTypes.ShippingProfileDTO
  > {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter((prof) => !!prof.id)
    const forCreate = input.filter(
      (prof): prof is FulfillmentTypes.CreateShippingProfileDTO => !prof.id
    )

    let created: ShippingProfile[] = []
    let updated: ShippingProfile[] = []

    if (forCreate.length) {
      created = await this.shippingProfileService_.create(
        forCreate,
        sharedContext
      )
    }
    if (forUpdate.length) {
      updated = await this.shippingProfileService_.update(
        forUpdate,
        sharedContext
      )
    }

    const result = [...created, ...updated]
    const allProfiles = await this.baseRepository_.serialize<
      | FulfillmentTypes.ShippingProfileDTO[]
      | FulfillmentTypes.ShippingProfileDTO
    >(result)

    return Array.isArray(data) ? allProfiles : allProfiles[0]
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
  @EmitEvents()
  async updateGeoZones(
    data:
      | FulfillmentTypes.UpdateGeoZoneDTO
      | FulfillmentTypes.UpdateGeoZoneDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<FulfillmentTypes.GeoZoneDTO | FulfillmentTypes.GeoZoneDTO[]> {
    const data_ = Array.isArray(data) ? data : [data]

    if (!data_.length) {
      return []
    }

    FulfillmentModuleService.validateGeoZones(data_)

    const updatedGeoZones = await this.geoZoneService_.update(
      data_,
      sharedContext
    )

    eventBuilders.updatedGeoZone({
      data: updatedGeoZones,
      sharedContext,
    })

    const serialized = await this.baseRepository_.serialize<
      FulfillmentTypes.GeoZoneDTO[]
    >(updatedGeoZones)

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
  @EmitEvents()
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
    >(updatedShippingOptionRules)
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

    validateAndNormalizeRules(data_ as unknown as Record<string, unknown>[])

    const updatedShippingOptionRules =
      await this.shippingOptionRuleService_.update(data_, sharedContext)

    eventBuilders.updatedShippingOptionRule({
      data: updatedShippingOptionRules.map((rule) => ({ id: rule.id })),
      sharedContext,
    })

    return Array.isArray(data)
      ? updatedShippingOptionRules
      : updatedShippingOptionRules[0]
  }

  @InjectManager("baseRepository_")
  @EmitEvents()
  async updateFulfillment(
    id: string,
    data: FulfillmentTypes.UpdateFulfillmentDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<FulfillmentTypes.FulfillmentDTO> {
    const fulfillment = await this.updateFulfillment_(id, data, sharedContext)

    return await this.baseRepository_.serialize<FulfillmentTypes.FulfillmentDTO>(
      fulfillment
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateFulfillment_(
    id: string,
    data: FulfillmentTypes.UpdateFulfillmentDTO,
    @MedusaContext() sharedContext: Context
  ): Promise<TFulfillmentEntity> {
    const existingFulfillment: TFulfillmentEntity =
      await this.fulfillmentService_.retrieve(
        id,
        {
          relations: ["items", "labels"],
        },
        sharedContext
      )

    const updatedLabelIds: string[] = []
    let deletedLabelIds: string[] = []

    const existingLabelIds = existingFulfillment.labels.map((label) => label.id)

    /**
     * @note
     * Since the relation is a one to many, the deletion, update and creation of labels
     * is handled b the orm. That means that we dont have to perform any manual deletions or update.
     * For some reason we use to have upsert and replace handled manually but we could simplify all that just like
     * we do below which will create the label, update some and delete the one that does not exists in the new data.
     *
     * There is a bit of logic as we need to reassign the data of those we want to keep
     * and we also need to emit the events later on.
     */
    if (isDefined(data.labels) && isPresent(data.labels)) {
      const dataLabelIds: string[] = data.labels
        .filter((label): label is { id: string } => "id" in label)
        .map((label) => label.id)

      deletedLabelIds = arrayDifference(existingLabelIds, dataLabelIds)

      for (let label of data.labels) {
        if (!("id" in label)) {
          continue
        }

        const existingLabel = existingFulfillment.labels.find(
          ({ id }) => id === label.id
        )!

        if (
          !existingLabel ||
          Object.keys(label).length === 1 ||
          deepEqualObj(existingLabel, label)
        ) {
          continue
        }

        updatedLabelIds.push(label.id)
        const labelData = { ...label }
        Object.assign(label, existingLabel, labelData)
      }
    }

    const [fulfillment] = await this.fulfillmentService_.update(
      [{ id, ...data }],
      sharedContext
    )

    this.handleFulfillmentUpdateEvents(
      fulfillment,
      existingLabelIds,
      updatedLabelIds,
      deletedLabelIds,
      sharedContext
    )

    return fulfillment
  }

  private handleFulfillmentUpdateEvents(
    fulfillment: Fulfillment,
    existingLabelIds: string[],
    updatedLabelIds: string[],
    deletedLabelIds: string[],
    sharedContext: Context
  ) {
    eventBuilders.updatedFulfillment({
      data: [{ id: fulfillment.id }],
      sharedContext,
    })

    eventBuilders.deletedFulfillmentLabel({
      data: deletedLabelIds.map((id) => ({ id })),
      sharedContext,
    })

    eventBuilders.updatedFulfillmentLabel({
      data: updatedLabelIds.map((id) => ({ id })),
      sharedContext,
    })

    const createdLabels = fulfillment.labels.filter((label) => {
      return !existingLabelIds.includes(label.id)
    })

    eventBuilders.createdFulfillmentLabel({
      data: createdLabels.map((label) => ({ id: label.id })),
      sharedContext,
    })
  }

  @InjectManager("baseRepository_")
  @EmitEvents()
  async cancelFulfillment(
    id: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<FulfillmentDTO> {
    const canceledAt = new Date()

    let fulfillment = await this.fulfillmentService_.retrieve(
      id,
      {},
      sharedContext
    )

    FulfillmentModuleService.canCancelFulfillmentOrThrow(fulfillment)

    // Make this action idempotent
    if (!fulfillment.canceled_at) {
      try {
        await this.fulfillmentProviderService_.cancelFulfillment(
          fulfillment.provider_id,
          fulfillment.data ?? {}
        )
      } catch (error) {
        throw error
      }

      fulfillment = await this.fulfillmentService_.update(
        {
          id,
          canceled_at: canceledAt,
        },
        sharedContext
      )

      eventBuilders.updatedFulfillment({
        data: [{ id }],
        sharedContext,
      })
    }

    const result = await this.baseRepository_.serialize(fulfillment)

    return Array.isArray(result) ? result[0] : result
  }

  async retrieveFulfillmentOptions(
    providerId: string
  ): Promise<Record<string, any>[]> {
    return await this.fulfillmentProviderService_.getFulfillmentOptions(
      providerId
    )
  }

  async validateFulfillmentOption(
    providerId: string,
    data: Record<string, unknown>
  ): Promise<boolean> {
    return await this.fulfillmentProviderService_.validateOption(
      providerId,
      data
    )
  }

  @InjectManager("baseRepository_")
  async validateShippingOption(
    shippingOptionId: string,
    context: Record<string, unknown> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const shippingOptions = await this.listShippingOptionsForContext(
      { id: shippingOptionId, context },
      {
        relations: ["rules"],
      },
      sharedContext
    )

    return !!shippingOptions.length
  }

  protected static canCancelFulfillmentOrThrow(fulfillment: Fulfillment) {
    if (fulfillment.shipped_at) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Fulfillment with id ${fulfillment.id} already shipped`
      )
    }

    if (fulfillment.delivered_at) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Fulfillment with id ${fulfillment.id} already delivered`
      )
    }

    return true
  }

  protected static validateMissingShippingOptions_(
    shippingOptions: ShippingOption[],
    shippingOptionsData: UpdateShippingOptionsInput[]
  ) {
    const missingShippingOptionIds = arrayDifference(
      shippingOptionsData.map((s) => s.id),
      shippingOptions.map((s) => s.id)
    )

    if (missingShippingOptionIds.length) {
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

  protected static validateGeoZones(
    geoZones: (
      | (Partial<FulfillmentTypes.CreateGeoZoneDTO> & { type: string })
      | (Partial<FulfillmentTypes.UpdateGeoZoneDTO> & { type: string })
    )[]
  ) {
    const requirePropForType = {
      country: ["country_code"],
      province: ["country_code", "province_code"],
      city: ["country_code", "province_code", "city"],
      zip: ["country_code", "province_code", "city", "postal_expression"],
    }

    for (const geoZone of geoZones) {
      if (!requirePropForType[geoZone.type]) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid geo zone type: ${geoZone.type}`
        )
      }

      for (const prop of requirePropForType[geoZone.type]) {
        if (!geoZone[prop]) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Missing required property ${prop} for geo zone type ${geoZone.type}`
          )
        }
      }
    }
  }

  protected static normalizeListShippingOptionsForContextParams(
    filters: FulfillmentTypes.FilterableShippingOptionForContextProps,
    config: FindConfig<ShippingOptionDTO> = {}
  ) {
    let {
      fulfillment_set_id,
      fulfillment_set_type,
      address,
      context,
      ...where
    } = filters

    const normalizedConfig = { ...config }
    normalizedConfig.relations = [
      "rules",
      "type",
      "shipping_profile",
      "provider",
      ...(normalizedConfig.relations ?? []),
    ]

    normalizedConfig.take =
      normalizedConfig.take ?? (context ? null : undefined)

    let normalizedFilters = { ...where }

    if (fulfillment_set_id || fulfillment_set_type) {
      const fulfillmentSetConstraints = {}

      if (fulfillment_set_id) {
        fulfillmentSetConstraints["id"] = fulfillment_set_id
      }

      if (fulfillment_set_type) {
        fulfillmentSetConstraints["type"] = fulfillment_set_type
      }

      normalizedFilters = {
        ...normalizedFilters,
        service_zone: {
          ...(normalizedFilters.service_zone ?? {}),
          fulfillment_set: {
            ...(normalizedFilters.service_zone?.fulfillment_set ?? {}),
            ...fulfillmentSetConstraints,
          },
        },
      }

      normalizedConfig.relations.push("service_zone.fulfillment_set")
    }

    if (address) {
      const geoZoneConstraints =
        FulfillmentModuleService.buildGeoZoneConstraintsFromAddress(address)

      if (geoZoneConstraints.length) {
        normalizedFilters = {
          ...normalizedFilters,
          service_zone: {
            ...(normalizedFilters.service_zone ?? {}),
            geo_zones: {
              $or: geoZoneConstraints.map((geoZoneConstraint) => ({
                // Apply eventually provided constraints on the geo zone along side the address constraints
                ...(normalizedFilters.service_zone?.geo_zones ?? {}),
                ...geoZoneConstraint,
              })),
            },
          },
        }

        normalizedConfig.relations.push("service_zone.geo_zones")
      }
    }

    normalizedConfig.relations = Array.from(new Set(normalizedConfig.relations))

    return {
      filters: normalizedFilters,
      config: normalizedConfig,
      context,
    }
  }

  /**
   * Build the constraints for the geo zones based on the address properties
   * available and the hierarchy of required properties.
   * We build a OR constraint from the narrowest to the broadest
   * e.g. if we have a postal expression we build a constraint for the postal expression require props of type zip
   * and a constraint for the city required props of type city
   * and a constraint for the province code required props of type province
   * and a constraint for the country code required props of type country
   * example:
   * {
   *    $or: [
   *      {
   *        type: "zip",
   *        country_code: "SE",
   *        province_code: "AB",
   *        city: "Stockholm",
   *        postal_expression: "12345"
   *      },
   *      {
   *        type: "city",
   *        country_code: "SE",
   *        province_code: "AB",
   *        city: "Stockholm"
   *      },
   *      {
   *        type: "province",
   *        country_code: "SE",
   *        province_code: "AB"
   *      },
   *      {
   *        type: "country",
   *        country_code: "SE"
   *      }
   *    ]
   *  }
   */
  protected static buildGeoZoneConstraintsFromAddress(
    address: FulfillmentTypes.FilterableShippingOptionForContextProps["address"]
  ) {
    /**
     * Define the hierarchy of required properties for the geo zones.
     */
    const geoZoneRequirePropertyHierarchy = {
      postal_expression: [
        "country_code",
        "province_code",
        "city",
        "postal_expression",
      ],
      city: ["country_code", "province_code", "city"],
      province_code: ["country_code", "province_code"],
      country_code: ["country_code"],
    }

    /**
     * Validate that the address has the required properties for the geo zones
     * constraints to build after. We are going from the narrowest to the broadest
     */
    Object.entries(geoZoneRequirePropertyHierarchy).forEach(
      ([prop, requiredProps]) => {
        if (address![prop]) {
          for (const requiredProp of requiredProps) {
            if (!address![requiredProp]) {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                `Missing required property ${requiredProp} for address when property ${prop} is set`
              )
            }
          }
        }
      }
    )

    const geoZoneConstraints = Object.entries(geoZoneRequirePropertyHierarchy)
      .map(([prop, requiredProps]) => {
        if (address![prop]) {
          return requiredProps.reduce((geoZoneConstraint, prop) => {
            geoZoneConstraint.type =
              prop === "postal_expression"
                ? "zip"
                : prop === "city"
                ? "city"
                : prop === "province_code"
                ? "province"
                : "country"
            geoZoneConstraint[prop] = address![prop]
            return geoZoneConstraint
          }, {} as Record<string, string | undefined>)
        }
        return null
      })
      .filter((v): v is Record<string, any> => !!v)

    return geoZoneConstraints
  }
}
