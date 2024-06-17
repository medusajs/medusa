import {
  Context,
  CreateRegionDTO,
  DAL,
  FilterableRegionProps,
  InternalModuleDeclaration,
  IRegionModuleService,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  RegionCountryDTO,
  RegionDTO,
  UpdateRegionDTO,
  UpsertRegionDTO,
} from "@medusajs/types"
import {
  arrayDifference,
  getDuplicates,
  InjectManager,
  InjectTransactionManager,
  isString,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  promiseAll,
  removeUndefined,
} from "@medusajs/utils"

import { Country, Region } from "@models"

import { UpdateRegionInput } from "@types"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  regionService: ModulesSdkTypes.IMedusaInternalService<any>
  countryService: ModulesSdkTypes.IMedusaInternalService<any>
}

const generateMethodForModels = { Country }

export default class RegionModuleService<
    TRegion extends Region = Region,
    TCountry extends Country = Country
  >
  extends ModulesSdkUtils.MedusaService<
    RegionDTO,
    {
      Country: {
        dto: RegionCountryDTO
      }
    }
  >(Region, generateMethodForModels, entityNameToLinkableKeysMap)
  implements IRegionModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly regionService_: ModulesSdkTypes.IMedusaInternalService<TRegion>
  protected readonly countryService_: ModulesSdkTypes.IMedusaInternalService<TCountry>

  constructor(
    { baseRepository, regionService, countryService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.regionService_ = regionService
    this.countryService_ = countryService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  async create(
    data: CreateRegionDTO[],
    sharedContext?: Context
  ): Promise<RegionDTO[]>
  async create(
    data: CreateRegionDTO,
    sharedContext?: Context
  ): Promise<RegionDTO>
  @InjectManager("baseRepository_")
  async create(
    data: CreateRegionDTO | CreateRegionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<RegionDTO | RegionDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const result = await this.create_(input, sharedContext)

    return await this.baseRepository_.serialize<RegionDTO[]>(
      Array.isArray(data) ? result : result[0]
    )
  }

  @InjectTransactionManager("baseRepository_")
  async create_(
    data: CreateRegionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Region[]> {
    let normalizedInput = RegionModuleService.normalizeInput(data)

    let normalizedDbRegions = normalizedInput.map((region) =>
      removeUndefined({
        ...region,
        countries: undefined,
      })
    )

    const result = await this.regionService_.create(
      normalizedDbRegions,
      sharedContext
    )

    if (data.some((input) => input.countries?.length)) {
      await this.validateCountries(
        normalizedInput.map((r) => r.countries ?? []).flat(),
        sharedContext
      )

      await this.countryService_.update(
        normalizedInput.map((region, i) => ({
          selector: { iso_2: region.countries },
          data: {
            region_id: result[i].id,
          },
        })),
        sharedContext
      )
    }

    return result
  }

  async upsert(
    data: UpsertRegionDTO[],
    sharedContext?: Context
  ): Promise<RegionDTO[]>
  async upsert(
    data: UpsertRegionDTO,
    sharedContext?: Context
  ): Promise<RegionDTO>
  @InjectTransactionManager("baseRepository_")
  async upsert(
    data: UpsertRegionDTO | UpsertRegionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<RegionDTO | RegionDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (region): region is UpdateRegionInput => !!region.id
    )
    const forCreate = input.filter(
      (region): region is CreateRegionDTO => !region.id
    )

    const operations: Promise<Region[]>[] = []

    if (forCreate.length) {
      operations.push(this.create_(forCreate, sharedContext))
    }
    if (forUpdate.length) {
      operations.push(this.update_(forUpdate, sharedContext))
    }

    const result = (await promiseAll(operations)).flat()
    return await this.baseRepository_.serialize<RegionDTO[] | RegionDTO>(
      Array.isArray(data) ? result : result[0]
    )
  }

  async update(
    id: string,
    data: UpdateRegionDTO,
    sharedContext?: Context
  ): Promise<RegionDTO>
  async update(
    selector: FilterableRegionProps,
    data: UpdateRegionDTO,
    sharedContext?: Context
  ): Promise<RegionDTO[]>
  @InjectManager("baseRepository_")
  async update(
    idOrSelector: string | FilterableRegionProps,
    data: UpdateRegionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<RegionDTO | RegionDTO[]> {
    let normalizedInput: UpdateRegionInput[] = []
    if (isString(idOrSelector)) {
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      const regions = await this.regionService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = regions.map((region) => ({
        id: region.id,
        ...data,
      }))
    }

    const updateResult = await this.update_(normalizedInput, sharedContext)

    const regions = await this.baseRepository_.serialize<
      RegionDTO[] | RegionDTO
    >(updateResult)

    return isString(idOrSelector) ? regions[0] : regions
  }

  @InjectTransactionManager("baseRepository_")
  protected async update_(
    data: UpdateRegionInput[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Region[]> {
    const normalizedInput = RegionModuleService.normalizeInput(data)

    // If countries are being updated for a region, first make previously set countries' region to null to get to a clean slate.
    // Somewhat less efficient, but region operations will be very rare, so it is better to go with a simple solution
    const regionsWithCountryUpdate = normalizedInput
      .filter((region) => !!region.countries)
      .map((region) => region.id)
      .flat()

    let normalizedDbRegions = normalizedInput.map((region) =>
      removeUndefined({
        ...region,
        countries: undefined, // -> delete countries if passed because we want to do update "manually"
      })
    )

    if (regionsWithCountryUpdate.length) {
      await this.countryService_.update(
        {
          selector: {
            region_id: regionsWithCountryUpdate,
          },
          data: { region_id: null },
        },
        sharedContext
      )

      await this.validateCountries(
        normalizedInput.map((d) => d.countries ?? []).flat(),
        sharedContext
      )

      await this.countryService_.update(
        normalizedInput.map((region) => ({
          selector: { iso_2: region.countries },
          data: {
            region_id: region.id,
          },
        })),
        sharedContext
      )
    }

    return await this.regionService_.update(normalizedDbRegions, sharedContext)
  }

  private static normalizeInput<T extends UpdateRegionDTO>(regions: T[]): T[] {
    return regions.map((region) =>
      removeUndefined({
        ...region,
        currency_code: region.currency_code?.toLowerCase(),
        name: region.name?.trim(),
        countries: region.countries?.map((country) => country.toLowerCase()),
      })
    )
  }

  /**
   * Validate that countries can be assigned to a region.
   *
   * NOTE: this method relies on countries of the regions that we are assigning to need to be unassigned first.
   * @param countries
   * @param sharedContext
   * @private
   */
  private async validateCountries(
    countries: string[] | undefined,
    sharedContext: Context
  ): Promise<TCountry[]> {
    if (!countries?.length) {
      return []
    }

    // The new regions being created have a country conflict
    const uniqueCountries = Array.from(new Set(countries))
    if (uniqueCountries.length !== countries.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Countries with codes: "${getDuplicates(countries).join(
          ", "
        )}" are already assigned to a region`
      )
    }

    const countriesInDb = await this.countryService_.list(
      { iso_2: uniqueCountries },
      { select: ["iso_2", "region_id"], take: null },
      sharedContext
    )
    const countryCodesInDb = countriesInDb.map((c) => c.iso_2.toLowerCase())

    // Countries missing in the database
    if (countriesInDb.length !== uniqueCountries.length) {
      const missingCountries = arrayDifference(
        uniqueCountries,
        countryCodesInDb
      )

      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Countries with codes: "${missingCountries.join(", ")}" do not exist`
      )
    }

    // Countries that already have a region already assigned to them
    const countriesWithRegion = countriesInDb.filter((c) => !!c.region_id)
    if (countriesWithRegion.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Countries with codes: "${countriesWithRegion
          .map((c) => c.iso_2)
          .join(", ")}" are already assigned to a region`
      )
    }

    return countriesInDb
  }
}
