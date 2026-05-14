import {
  CalculatedShippingOptionPrice,
  Context,
  DAL,
  FilterableFulfillmentSetProps,
  FindConfig,
  FulfillmentDTO,
  FulfillmentOption,
  FulfillmentTypes,
  IFulfillmentModuleService,
  InferEntityType,
  InternalModuleDeclaration,
  Logger,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  ShippingOptionDTO,
  SoftDeleteReturn,
  UpdateFulfillmentSetDTO,
  UpdateServiceZoneDTO,
  ValidateFulfillmentDataContext,
} from "@medusajs/framework/types"
import {
  arrayDifference,
  deepCopy,
  deepEqualObj,
  EmitEvents,
  getSetDifference,
  InjectManager,
  InjectTransactionManager,
  isDefined,
  isPresent,
  isString,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  promiseAll,
} from "@medusajs/framework/utils"
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
import { isContextValid, Rule, validateAndNormalizeRules } from "@utils"
import { joinerConfig } from "../joiner-config"
import { UpdateShippingOptionsInput } from "../types/service"
import FulfillmentProviderService from "./fulfillment-provider"

const generateMethodForModels = {
  FulfillmentSet,
  ServiceZone,
  ShippingOption,
  GeoZone,
  ShippingProfile,
  ShippingOptionRule,
  ShippingOptionType,
  FulfillmentProvider,
  // Not adding Fulfillment to not auto generate the methods under the hood and only provide the methods we want to expose
}

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  fulfillmentAddressService: ModulesSdkTypes.IMedusaInternalService<any>
  fulfillmentSetService: ModulesSdkTypes.IMedusaInternalService<any>
  serviceZoneService: ModulesSdkTypes.IMedusaInternalService<any>
  geoZoneService: ModulesSdkTypes.IMedusaInternalService<any>
  shippingProfileService: ModulesSdkTypes.IMedusaInternalService<any>
  shippingOptionService: ModulesSdkTypes.IMedusaInternalService<any>
  shippingOptionRuleService: ModulesSdkTypes.IMedusaInternalService<any>
  shippingOptionTypeService: ModulesSdkTypes.IMedusaInternalService<any>
  fulfillmentProviderService: FulfillmentProviderService
  fulfillmentService: ModulesSdkTypes.IMedusaInternalService<any>
  logger?: Logger
}

export default class FulfillmentModuleService
  extends ModulesSdkUtils.MedusaService<{
    FulfillmentSet: { dto: FulfillmentTypes.FulfillmentSetDTO }
    ServiceZone: { dto: FulfillmentTypes.ServiceZoneDTO }
    ShippingOption: { dto: FulfillmentTypes.ShippingOptionDTO }
    GeoZone: { dto: FulfillmentTypes.GeoZoneDTO }
    ShippingProfile: { dto: FulfillmentTypes.ShippingProfileDTO }
    ShippingOptionRule: { dto: FulfillmentTypes.ShippingOptionRuleDTO }
    ShippingOptionType: { dto: FulfillmentTypes.ShippingOptionTypeDTO }
    FulfillmentProvider: { dto: FulfillmentTypes.FulfillmentProviderDTO }
  }>(generateMethodForModels)
  implements IFulfillmentModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly fulfillmentSetService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof FulfillmentSet>
  >
  protected readonly serviceZoneService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ServiceZone>
  >
  protected readonly geoZoneService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof GeoZone>
  >
  protected readonly shippingProfileService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ShippingProfile>
  >
  protected readonly shippingOptionService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ShippingOption>
  >
  protected readonly shippingOptionRuleService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ShippingOptionRule>
  >
  protected readonly shippingOptionTypeService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ShippingOptionType>
  >
  protected readonly fulfillmentProviderService_: FulfillmentProviderService
  protected readonly fulfillmentService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof Fulfillment>
  >

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
      fulfillmentAddressService,
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

  @InjectManager()
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

  @InjectManager()
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
          shippingOption.rules.map((r) => r) as unknown as Rule[]
        )
      })
    }

    return await this.baseRepository_.serialize<
      FulfillmentTypes.ShippingOptionDTO[]
    >(shippingOptions)
  }

  @InjectManager()
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

  @InjectManager()
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

  @InjectManager()
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

  // @ts-expect-error
  createFulfillmentSets(
    data: FulfillmentTypes.CreateFulfillmentSetDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.FulfillmentSetDTO[]>
  // @ts-expect-error
  createFulfillmentSets(
    data: FulfillmentTypes.CreateFulfillmentSetDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.FulfillmentSetDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createFulfillmentSets(
    data:
      | FulfillmentTypes.CreateFulfillmentSetDTO
      | FulfillmentTypes.CreateFulfillmentSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.FulfillmentSetDTO | FulfillmentTypes.FulfillmentSetDTO[]
  > {
    const createdFulfillmentSets = await this.createFulfillmentSets_(
      data,
      sharedContext
    )

    const returnedFulfillmentSets = Array.isArray(data)
      ? createdFulfillmentSets
      : createdFulfillmentSets[0]

    return await this.baseRepository_.serialize<
      FulfillmentTypes.FulfillmentSetDTO | FulfillmentTypes.FulfillmentSetDTO[]
    >(returnedFulfillmentSets)
  }

  @InjectTransactionManager()
  protected async createFulfillmentSets_(
    data:
      | FulfillmentTypes.CreateFulfillmentSetDTO
      | FulfillmentTypes.CreateFulfillmentSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof FulfillmentSet>[]> {
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

    return createdFulfillmentSets
  }

  // @ts-ignore
  createServiceZones(
    data: FulfillmentTypes.CreateServiceZoneDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO[]>
  // @ts-expect-error
  createServiceZones(
    data: FulfillmentTypes.CreateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

  @InjectTransactionManager()
  protected async createServiceZones_(
    data:
      | FulfillmentTypes.CreateServiceZoneDTO[]
      | FulfillmentTypes.CreateServiceZoneDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ServiceZone>[]> {
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

    return createdServiceZones
  }

  // @ts-ignore
  createShippingOptions(
    data: FulfillmentTypes.CreateShippingOptionDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionDTO[]>
  // @ts-expect-error
  createShippingOptions(
    data: FulfillmentTypes.CreateShippingOptionDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

  @InjectTransactionManager()
  async createShippingOptions_(
    data:
      | FulfillmentTypes.CreateShippingOptionDTO[]
      | FulfillmentTypes.CreateShippingOptionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ShippingOption>[]> {
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

    return createdSO
  }

  // @ts-ignore
  createShippingProfiles(
    data: FulfillmentTypes.CreateShippingProfileDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingProfileDTO[]>
  // @ts-expect-error
  createShippingProfiles(
    data: FulfillmentTypes.CreateShippingProfileDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingProfileDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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
    >(
      Array.isArray(data) ? createdShippingProfiles : createdShippingProfiles[0]
    )
  }

  @InjectTransactionManager()
  async createShippingProfiles_(
    data:
      | FulfillmentTypes.CreateShippingProfileDTO[]
      | FulfillmentTypes.CreateShippingProfileDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ShippingProfile>[]> {
    const data_ = Array.isArray(data) ? data : [data]

    if (!data_.length) {
      return []
    }

    return await this.shippingProfileService_.create(data_, sharedContext)
  }

  // @ts-expect-error
  createGeoZones(
    data: FulfillmentTypes.CreateGeoZoneDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.GeoZoneDTO[]>
  // @ts-expect-error
  createGeoZones(
    data: FulfillmentTypes.CreateGeoZoneDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.GeoZoneDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

    return await this.baseRepository_.serialize<FulfillmentTypes.GeoZoneDTO[]>(
      Array.isArray(data) ? createdGeoZones : createdGeoZones[0]
    )
  }

  // @ts-expect-error
  async createShippingOptionRules(
    data: FulfillmentTypes.CreateShippingOptionRuleDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionRuleDTO[]>
  // @ts-expect-error
  async createShippingOptionRules(
    data: FulfillmentTypes.CreateShippingOptionRuleDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionRuleDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

  @InjectTransactionManager()
  async createShippingOptionRules_(
    data:
      | FulfillmentTypes.CreateShippingOptionRuleDTO[]
      | FulfillmentTypes.CreateShippingOptionRuleDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ShippingOptionRule>[]> {
    const data_ = Array.isArray(data) ? data : [data]

    if (!data_.length) {
      return []
    }

    validateAndNormalizeRules(data_ as unknown as Record<string, unknown>[])

    const createdSORules = await this.shippingOptionRuleService_.create(
      data_,
      sharedContext
    )

    return createdSORules
  }

  @InjectManager()
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

    try {
      const providerResult =
        await this.fulfillmentProviderService_.createFulfillment(
          provider_id!, // TODO: should we add a runtime check on provider_id being provided?
          fulfillmentData || {},
          items.map((i) => i),
          order,
          fulfillmentRest as unknown as Partial<FulfillmentDTO>
        )
      await this.fulfillmentService_.update(
        {
          id: fulfillment.id,
          data: providerResult.data ?? {},
          labels: providerResult.labels ?? [],
        },
        sharedContext
      )
    } catch (error) {
      await this.fulfillmentService_.delete(fulfillment.id, sharedContext)
      throw error
    }

    return await this.baseRepository_.serialize<FulfillmentTypes.FulfillmentDTO>(
      fulfillment
    )
  }

  @InjectManager()
  @EmitEvents()
  async deleteFulfillment(
    id: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const fulfillment = await this.fulfillmentService_.retrieve(
      id,
      {},
      sharedContext
    )

    if (!isPresent(fulfillment.canceled_at)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Fulfillment with id ${fulfillment.id} needs to be canceled first before deleting`
      )
    }

    await this.fulfillmentService_.delete(id, sharedContext)
  }

  @InjectManager()
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

    const shippingOption = await this.shippingOptionService_.retrieve(
      fulfillment.shipping_option_id!,
      {
        select: ["id", "name", "data", "metadata"],
      },
      sharedContext
    )

    try {
      const providerResult =
        await this.fulfillmentProviderService_.createReturn(
          fulfillment.provider_id!, // TODO: should we add a runtime check on provider_id being provided?,
          {
            ...fulfillment,
            shipping_option: shippingOption,
          } as Record<any, any>
        )
      await this.fulfillmentService_.update(
        {
          id: fulfillment.id,
          data: providerResult.data ?? {},
          labels: providerResult.labels ?? [],
        },
        sharedContext
      )
    } catch (error) {
      await this.fulfillmentService_.delete(fulfillment.id, sharedContext)
      throw error
    }

    return await this.baseRepository_.serialize<FulfillmentTypes.FulfillmentDTO>(
      fulfillment
    )
  }

  // @ts-expect-error
  updateFulfillmentSets(
    data: FulfillmentTypes.UpdateFulfillmentSetDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.FulfillmentSetDTO[]>
  // @ts-expect-error
  updateFulfillmentSets(
    data: FulfillmentTypes.UpdateFulfillmentSetDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.FulfillmentSetDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateFulfillmentSets(
    data: UpdateFulfillmentSetDTO[] | UpdateFulfillmentSetDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.FulfillmentSetDTO[] | FulfillmentTypes.FulfillmentSetDTO
  > {
    const updatedFulfillmentSets = await this.updateFulfillmentSets_(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      FulfillmentTypes.FulfillmentSetDTO | FulfillmentTypes.FulfillmentSetDTO[]
    >(updatedFulfillmentSets)
  }

  @InjectTransactionManager()
  protected async updateFulfillmentSets_(
    data: UpdateFulfillmentSetDTO[] | UpdateFulfillmentSetDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    | InferEntityType<typeof FulfillmentSet>[]
    | InferEntityType<typeof FulfillmentSet>
  > {
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

    const fulfillmentSetMap = new Map<
      string,
      InferEntityType<typeof FulfillmentSet>
    >(fulfillmentSets.map((f) => [f.id, f]))

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

  // @ts-ignore
  updateServiceZones(
    id: string,
    data: FulfillmentTypes.UpdateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO>
  // @ts-expect-error
  updateServiceZones(
    selector: FulfillmentTypes.FilterableServiceZoneProps,
    data: FulfillmentTypes.UpdateServiceZoneDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

  @InjectTransactionManager()
  protected async updateServiceZones_(
    data:
      | FulfillmentTypes.UpdateServiceZoneDTO[]
      | FulfillmentTypes.UpdateServiceZoneDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    InferEntityType<typeof ServiceZone> | InferEntityType<typeof ServiceZone>[]
  > {
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

    const serviceZoneMap = new Map<string, InferEntityType<typeof ServiceZone>>(
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

  upsertServiceZones(
    data: FulfillmentTypes.UpsertServiceZoneDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO>
  upsertServiceZones(
    data: FulfillmentTypes.UpsertServiceZoneDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ServiceZoneDTO[]>

  @InjectManager()
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

  @InjectTransactionManager()
  async upsertServiceZones_(
    data:
      | FulfillmentTypes.UpsertServiceZoneDTO[]
      | FulfillmentTypes.UpsertServiceZoneDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    InferEntityType<typeof ServiceZone>[] | InferEntityType<typeof ServiceZone>
  > {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (serviceZone): serviceZone is FulfillmentTypes.UpdateServiceZoneDTO =>
        !!serviceZone.id
    )
    const forCreate = input.filter(
      (serviceZone): serviceZone is FulfillmentTypes.CreateServiceZoneDTO =>
        !serviceZone.id
    )

    const created: InferEntityType<typeof ServiceZone>[] = []
    const updated: InferEntityType<typeof ServiceZone>[] = []

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

  // @ts-ignore
  updateShippingOptions(
    id: string,
    data: FulfillmentTypes.UpdateShippingOptionDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionDTO>
  // @ts-expect-error
  updateShippingOptions(
    selector: FulfillmentTypes.FilterableShippingOptionProps,
    data: FulfillmentTypes.UpdateShippingOptionDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

  @InjectTransactionManager()
  async updateShippingOptions_(
    data: UpdateShippingOptionsInput[] | UpdateShippingOptionsInput,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    | InferEntityType<typeof ShippingOption>
    | InferEntityType<typeof ShippingOption>[]
  > {
    const dataArray = Array.isArray(data)
      ? data.map((d) => deepCopy(d))
      : [deepCopy(data)]

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

    dataArray.forEach((shippingOption) => {
      const existingShippingOption = existingShippingOptions.get(
        shippingOption.id
      )! // Guaranteed to exist since the validation above have been performed

      // `type_id` doesn't exist on the entity/table, `type_id` argument is mapped to `shipping_option_type_id`
      if (shippingOption.type_id) {
        shippingOption.shipping_option_type_id = shippingOption.type_id
        delete shippingOption.type_id
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
        | FulfillmentTypes.UpdateShippingOptionRuleDTO
        | InferEntityType<typeof ShippingOptionRule>
      > = new Map(existingRules.map((rule) => [rule.id, rule]))

      const updatedRules = shippingOption.rules
        .map((rule) => {
          if ("id" in rule) {
            const existingRule = (existingRulesMap.get(rule.id) ??
              {}) as FulfillmentTypes.UpdateShippingOptionRuleDTO

            if (existingRulesMap.get(rule.id)) {
              updatedRuleIds.push(rule.id)
            }

            // @ts-ignore
            delete rule.created_at
            // @ts-ignore
            delete rule.updated_at
            // @ts-ignore
            delete rule.deleted_at

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

  async upsertShippingOptions(
    data: FulfillmentTypes.UpsertShippingOptionDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionDTO[]>
  async upsertShippingOptions(
    data: FulfillmentTypes.UpsertShippingOptionDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionDTO>

  @InjectManager()
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

  @InjectTransactionManager()
  async upsertShippingOptions_(
    data:
      | FulfillmentTypes.UpsertShippingOptionDTO[]
      | FulfillmentTypes.UpsertShippingOptionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ShippingOption>[]> {
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

    let created: InferEntityType<typeof ShippingOption>[] = []
    let updated: InferEntityType<typeof ShippingOption>[] = []

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

  async upsertShippingOptionTypes(
    data: FulfillmentTypes.UpsertShippingOptionTypeDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionTypeDTO[]>
  async upsertShippingOptionTypes(
    data: FulfillmentTypes.UpsertShippingOptionTypeDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionTypeDTO>

  @InjectManager()
  @EmitEvents()
  async upsertShippingOptionTypes(
    data:
      | FulfillmentTypes.UpsertShippingOptionTypeDTO[]
      | FulfillmentTypes.UpsertShippingOptionTypeDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    | FulfillmentTypes.ShippingOptionTypeDTO[]
    | FulfillmentTypes.ShippingOptionTypeDTO
  > {
    const results = await this.updateShippingOptionTypes_(data, sharedContext)

    const allTypes = await this.baseRepository_.serialize<
      | FulfillmentTypes.ShippingOptionTypeDTO[]
      | FulfillmentTypes.ShippingOptionTypeDTO
    >(results)

    return Array.isArray(data) ? allTypes : allTypes[0]
  }

  @InjectTransactionManager()
  protected async updateShippingOptionTypes_(
    data:
      | FulfillmentTypes.UpsertShippingOptionTypeDTO[]
      | FulfillmentTypes.UpsertShippingOptionTypeDTO,
    sharedContext: Context
  ): Promise<InferEntityType<typeof ShippingOptionType>[]> {
    const input = Array.isArray(data) ? data : [data]

    const results = await this.shippingOptionTypeService_.upsert(
      input,
      sharedContext
    )

    return results
  }

  // @ts-expect-error
  updateShippingOptionTypes(
    id: string,
    data: FulfillmentTypes.UpdateShippingOptionTypeDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionTypeDTO>
  // @ts-expect-error
  updateShippingOptionTypes(
    selector: FulfillmentTypes.FilterableShippingOptionTypeProps,
    data: FulfillmentTypes.UpdateShippingOptionTypeDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionTypeDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateShippingOptionTypes(
    idOrSelector: string | FulfillmentTypes.FilterableShippingOptionTypeProps,
    data: FulfillmentTypes.UpdateShippingOptionTypeDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    | FulfillmentTypes.ShippingOptionTypeDTO[]
    | FulfillmentTypes.ShippingOptionTypeDTO
  > {
    let normalizedInput: FulfillmentTypes.UpdateShippingOptionTypeDTO[] = []
    if (isString(idOrSelector)) {
      // Check if the type exists in the first place
      await this.shippingOptionTypeService_.retrieve(
        idOrSelector,
        {},
        sharedContext
      )
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      const types = await this.shippingOptionTypeService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = types.map((type) => ({
        id: type.id,
        ...data,
      }))
    }

    const types = await this.shippingOptionTypeService_.update(
      normalizedInput,
      sharedContext
    )

    const updatedTypes = await this.baseRepository_.serialize<
      FulfillmentTypes.ShippingOptionTypeDTO[]
    >(types)

    return isString(idOrSelector) ? updatedTypes[0] : updatedTypes
  }

  // @ts-expect-error
  updateShippingProfiles(
    selector: FulfillmentTypes.FilterableShippingProfileProps,
    data: FulfillmentTypes.UpdateShippingProfileDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingProfileDTO[]>
  // @ts-expect-error
  updateShippingProfiles(
    id: string,
    data: FulfillmentTypes.UpdateShippingProfileDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingProfileDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateShippingProfiles(
    idOrSelector: string | FulfillmentTypes.FilterableShippingProfileProps,
    data: FulfillmentTypes.UpdateShippingProfileDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.ShippingProfileDTO | FulfillmentTypes.ShippingProfileDTO[]
  > {
    const profiles = await this.updateShippingProfiles_(
      idOrSelector,
      data,
      sharedContext
    )

    const updatedProfiles = await this.baseRepository_.serialize<
      FulfillmentTypes.ShippingProfileDTO[]
    >(profiles)

    return isString(idOrSelector) ? updatedProfiles[0] : updatedProfiles
  }

  @InjectTransactionManager()
  protected async updateShippingProfiles_(
    idOrSelector: string | FulfillmentTypes.FilterableShippingProfileProps,
    data: FulfillmentTypes.UpdateShippingProfileDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ShippingProfile>[]> {
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

    return profiles
  }

  async upsertShippingProfiles(
    data: FulfillmentTypes.UpsertShippingProfileDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingProfileDTO[]>
  async upsertShippingProfiles(
    data: FulfillmentTypes.UpsertShippingProfileDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingProfileDTO>

  @InjectManager()
  @EmitEvents()
  async upsertShippingProfiles(
    data:
      | FulfillmentTypes.UpsertShippingProfileDTO[]
      | FulfillmentTypes.UpsertShippingProfileDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    FulfillmentTypes.ShippingProfileDTO[] | FulfillmentTypes.ShippingProfileDTO
  > {
    const profiles = await this.upsertShippingProfiles_(data, sharedContext)

    return await this.baseRepository_.serialize<
      | FulfillmentTypes.ShippingProfileDTO[]
      | FulfillmentTypes.ShippingProfileDTO
    >(Array.isArray(data) ? profiles : profiles[0])
  }

  @InjectTransactionManager()
  protected async upsertShippingProfiles_(
    data:
      | FulfillmentTypes.UpsertShippingProfileDTO[]
      | FulfillmentTypes.UpsertShippingProfileDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    | InferEntityType<typeof ShippingProfile>[]
    | InferEntityType<typeof ShippingProfile>
  > {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter((prof) => !!prof.id)
    const forCreate = input.filter(
      (prof): prof is FulfillmentTypes.CreateShippingProfileDTO => !prof.id
    )

    let created: InferEntityType<typeof ShippingProfile>[] = []
    let updated: InferEntityType<typeof ShippingProfile>[] = []

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

    return [...created, ...updated]
  }

  // @ts-expect-error
  updateGeoZones(
    data: FulfillmentTypes.UpdateGeoZoneDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.GeoZoneDTO[]>
  // @ts-expect-error
  updateGeoZones(
    data: FulfillmentTypes.UpdateGeoZoneDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.GeoZoneDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

    const serialized = await this.baseRepository_.serialize<
      FulfillmentTypes.GeoZoneDTO[]
    >(updatedGeoZones)

    return Array.isArray(data) ? serialized : serialized[0]
  }

  // @ts-expect-error
  updateShippingOptionRules(
    data: FulfillmentTypes.UpdateShippingOptionRuleDTO[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionRuleDTO[]>
  // @ts-expect-error
  updateShippingOptionRules(
    data: FulfillmentTypes.UpdateShippingOptionRuleDTO,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.ShippingOptionRuleDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

  @InjectTransactionManager()
  async updateShippingOptionRules_(
    data:
      | FulfillmentTypes.UpdateShippingOptionRuleDTO[]
      | FulfillmentTypes.UpdateShippingOptionRuleDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    | InferEntityType<typeof ShippingOptionRule>
    | InferEntityType<typeof ShippingOptionRule>[]
  > {
    const data_ = Array.isArray(data) ? data : [data]

    if (!data_.length) {
      return []
    }

    validateAndNormalizeRules(data_ as unknown as Record<string, unknown>[])

    const updatedShippingOptionRules =
      await this.shippingOptionRuleService_.update(data_, sharedContext)

    return Array.isArray(data)
      ? updatedShippingOptionRules
      : updatedShippingOptionRules[0]
  }

  @InjectManager()
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

  @InjectTransactionManager()
  protected async updateFulfillment_(
    id: string,
    data: FulfillmentTypes.UpdateFulfillmentDTO,
    @MedusaContext() sharedContext: Context
  ): Promise<InferEntityType<typeof Fulfillment>> {
    const existingFulfillment: InferEntityType<typeof Fulfillment> =
      await this.fulfillmentService_.retrieve(
        id,
        {
          relations: ["items", "labels"],
        },
        sharedContext
      )

    const updatedLabelIds: string[] = []

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

    return fulfillment
  }

  @InjectManager()
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
          fulfillment.provider_id!, // TODO: should we add a runtime check on provider_id being provided?,
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
    }

    const result = await this.baseRepository_.serialize<FulfillmentDTO>(
      fulfillment
    )

    return result
  }

  async retrieveFulfillmentOptions(
    providerId: string
  ): Promise<FulfillmentOption[]> {
    return await this.fulfillmentProviderService_.getFulfillmentOptions(
      providerId
    )
  }

  async validateFulfillmentData(
    providerId: string,
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: ValidateFulfillmentDataContext
  ): Promise<Record<string, unknown>> {
    return await this.fulfillmentProviderService_.validateFulfillmentData(
      providerId,
      optionData,
      data,
      context
    )
  }

  // TODO: seems not to be used, what is the purpose of this method?
  async validateFulfillmentOption(
    providerId: string,
    data: Record<string, unknown>
  ): Promise<boolean> {
    return await this.fulfillmentProviderService_.validateOption(
      providerId,
      data
    )
  }

  @InjectManager()
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

  @InjectManager()
  async validateShippingOptionsForPriceCalculation(
    shippingOptionsData: FulfillmentTypes.CreateShippingOptionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<boolean[]> {
    const nonCalculatedOptions = shippingOptionsData.filter(
      (option) => option.price_type !== "calculated"
    )

    if (nonCalculatedOptions.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot calculate price for non-calculated shipping options: ${nonCalculatedOptions
          .map((o) => o.name)
          .join(", ")}`
      )
    }

    const promises = shippingOptionsData.map((option) =>
      this.fulfillmentProviderService_.canCalculate(option.provider_id, option)
    )

    return await promiseAll(promises)
  }

  async calculateShippingOptionsPrices(
    shippingOptionsData: FulfillmentTypes.CalculateShippingOptionPriceDTO[]
  ): Promise<CalculatedShippingOptionPrice[]> {
    const promises = shippingOptionsData.map((data) =>
      this.fulfillmentProviderService_.calculatePrice(
        data.provider_id,
        data.optionData,
        data.data,
        data.context
      )
    )

    return await promiseAll(promises)
  }

  @InjectTransactionManager()
  @EmitEvents()
  // @ts-expect-error
  async deleteShippingProfiles(
    ids: string | string[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const shippingProfileIds = Array.isArray(ids) ? ids : [ids]
    await this.validateShippingProfileDeletion(
      shippingProfileIds,
      sharedContext
    )

    return await super.deleteShippingProfiles(shippingProfileIds, sharedContext)
  }

  @InjectTransactionManager()
  @EmitEvents()
  // @ts-expect-error
  async softDeleteShippingProfiles<
    TReturnableLinkableKeys extends string = string
  >(
    ids: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]> | void> {
    await this.validateShippingProfileDeletion(ids, sharedContext)

    return await super.softDeleteShippingProfiles(ids, config, sharedContext)
  }

  protected async validateShippingProfileDeletion(
    ids: string[],
    sharedContext: Context
  ) {
    const shippingProfileIds = Array.isArray(ids) ? ids : [ids]
    const shippingProfiles = await this.shippingProfileService_.list(
      { id: shippingProfileIds },
      {
        relations: ["shipping_options.id"],
      },
      sharedContext
    )

    const undeletableShippingProfiles = shippingProfiles.filter(
      (profile) => profile.shipping_options.length > 0
    )
    if (undeletableShippingProfiles.length) {
      const undeletableShippingProfileIds = undeletableShippingProfiles.map(
        (profile) => profile.id
      )

      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot delete Shipping Profiles ${undeletableShippingProfileIds} with associated Shipping Options. Delete Shipping Options first and try again.`
      )
    }
  }

  protected static canCancelFulfillmentOrThrow(
    fulfillment: InferEntityType<typeof Fulfillment>
  ) {
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
    shippingOptions: InferEntityType<typeof ShippingOption>[],
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
    shippingOption: InferEntityType<typeof ShippingOption>,
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
      postal_expression: {
        props: ["country_code", "province_code", "city", "postal_expression"],
        type: "zip",
      },
      city: {
        props: ["country_code", "province_code", "city"],
        type: "city",
      },
      province_code: {
        props: ["country_code", "province_code"],
        type: "province",
      },
      country_code: {
        props: ["country_code"],
        type: "country",
      },
    }

    /**
     * The following changes assume that the lowest level check (e.g postal expression) can't exist multiple times in the higher level (e.g country)
     * In case we encounter situations where it is possible to have multiple postal expressions for the same country we need to change the logic back
     * to this pr https://github.com/medusajs/medusa/pull/8066
     */

    const geoZoneConstraints = Object.entries(geoZoneRequirePropertyHierarchy)
      .map(([prop, { props, type }]) => {
        if (address![prop]) {
          return {
            type,
            ...props.reduce((geoZoneConstraint, prop) => {
              if (isPresent(address![prop])) {
                geoZoneConstraint[prop] = address![prop]
              }
              return geoZoneConstraint
            }, {} as Record<string, string | undefined>),
          }
        }
        return null
      })
      .filter((v) => !!v)

    return geoZoneConstraints
  }
}
