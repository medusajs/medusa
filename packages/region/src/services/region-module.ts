import {
  Context,
  CountryDTO,
  CreateRegionDTO,
  DAL,
  FilterableRegionProps,
  InternalModuleDeclaration,
  IRegionModuleService,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  RegionCountryDTO,
  RegionCurrencyDTO,
  RegionDTO,
  UpdatableRegionFields,
  UpdateRegionDTO,
} from "@medusajs/types"
import {
  arrayDifference,
  InjectManager,
  InjectTransactionManager,
  isObject,
  isString,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  promiseAll,
} from "@medusajs/utils"

import { Country, Currency, Region } from "@models"

import { DefaultsUtils } from "@medusajs/utils"
import { CreateCountryDTO, CreateCurrencyDTO } from "@types"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"

const COUNTRIES_LIMIT = 1000

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  regionService: ModulesSdkTypes.InternalModuleService<any>
  countryService: ModulesSdkTypes.InternalModuleService<any>
  currencyService: ModulesSdkTypes.InternalModuleService<any>
}

const generateMethodForModels = [Country, Currency]

export default class RegionModuleService<
    TRegion extends Region = Region,
    TCountry extends Country = Country,
    TCurrency extends Currency = Currency
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    RegionDTO,
    {
      Country: {
        dto: RegionCountryDTO
      }
      Currency: {
        dto: RegionCurrencyDTO
      }
    }
  >(Region, generateMethodForModels, entityNameToLinkableKeysMap)
  implements IRegionModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly regionService_: ModulesSdkTypes.InternalModuleService<TRegion>
  protected readonly countryService_: ModulesSdkTypes.InternalModuleService<TCountry>
  protected readonly currencyService_: ModulesSdkTypes.InternalModuleService<TCurrency>

  constructor(
    {
      baseRepository,
      regionService,
      countryService,
      currencyService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.regionService_ = regionService
    this.countryService_ = countryService
    this.currencyService_ = currencyService
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
    let normalizedInput = this.normalizeInput(data)

    const validations = [
      this.validateCurrencies(
        normalizedInput.map((r) => r.currency_code),
        sharedContext
      ),
      this.validateCountries(
        normalizedInput.map((r) => r.countries ?? []).flat(),
        sharedContext
      ),
    ] as const

    // Assign the full country object so the ORM updates the relationship
    const [, dbCountries] = await Promise.all(validations)
    const dbCountriesMap = asMap(dbCountries, "iso_2")
    let normalizedDbRegions = normalizedInput.map((region) =>
      removeUndefined({
        ...region,
        countries: region.countries?.map((c) => dbCountriesMap[c]),
      })
    )

    // Create the regions and update the country region_id
    return await this.regionService_.create(normalizedDbRegions, sharedContext)
  }

  async update(
    selector: FilterableRegionProps,
    data: UpdatableRegionFields,
    sharedContext?: Context
  ): Promise<RegionDTO[]>
  async update(
    regionId: string,
    data: UpdatableRegionFields,
    sharedContext?: Context
  ): Promise<RegionDTO>
  async update(data: UpdateRegionDTO[]): Promise<RegionDTO[]>
  @InjectManager("baseRepository_")
  async update(
    idOrSelectorOrData: string | FilterableRegionProps | UpdateRegionDTO[],
    data?: UpdatableRegionFields,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<RegionDTO | RegionDTO[]> {
    const updateResult = await this.update_(
      idOrSelectorOrData,
      data,
      sharedContext
    )
    const resultWithRelations = await this.regionService_.list(
      { id: updateResult.map((r) => r.id) },
      { relations: ["currency", "countries"] },
      sharedContext
    )

    const regions = await this.baseRepository_.serialize<
      RegionDTO[] | RegionDTO
    >(resultWithRelations)

    return isString(idOrSelectorOrData) ? regions[0] : regions
  }

  @InjectTransactionManager("baseRepository_")
  protected async update_(
    idOrSelectorOrData: string | FilterableRegionProps | UpdateRegionDTO[],
    data?: UpdatableRegionFields,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Region[]> {
    let normalizedInput: UpdateRegionDTO[] = []
    if (isString(idOrSelectorOrData)) {
      normalizedInput = [{ id: idOrSelectorOrData, ...data }]
    }

    if (Array.isArray(idOrSelectorOrData)) {
      normalizedInput = idOrSelectorOrData
    }

    if (isObject(idOrSelectorOrData)) {
      const regions = await this.regionService_.list(
        idOrSelectorOrData,
        {},
        sharedContext
      )

      normalizedInput = regions.map((region) => ({
        id: region.id,
        ...data,
      }))
    }
    normalizedInput = this.normalizeInput(normalizedInput)

    // If countries are being updated for a region, first make previously set countries' region to null to get to a clean slate.
    // Somewhat less efficient, but region operations will be very rare, so it is better to go with a simple solution
    await this.countryService_.update(
      {
        selector: {
          region_id: normalizedInput
            .filter((region) => !!region.countries)
            .map((region) => region.id)
            .flat(),
        },
        data: { region_id: null },
      },
      sharedContext
    )

    const validations = [
      this.validateCurrencies(
        normalizedInput.map((d) => d.currency_code),
        sharedContext
      ),
      this.validateCountries(
        normalizedInput.map((d) => d.countries ?? []).flat(),
        sharedContext
      ),
    ] as const

    // Assign the full country object so the ORM updates the relationship
    const [, dbCountries] = await Promise.all(validations)
    const dbCountriesMap = asMap(dbCountries, "iso_2")
    let normalizedDbRegions = normalizedInput.map((region) =>
      removeUndefined({
        ...region,
        countries: region.countries?.map((c) => dbCountriesMap[c]),
      })
    )

    return await this.regionService_.update(normalizedDbRegions, sharedContext)
  }

  private normalizeInput<T extends UpdatableRegionFields>(regions: T[]): T[] {
    return regions.map((region) =>
      removeUndefined({
        ...region,
        currency_code: region.currency_code?.toLowerCase(),
        name: region.name?.trim(),
        countries: region.countries?.map((country) => country.toLowerCase()),
      })
    )
  }

  @InjectTransactionManager("baseRepository_")
  private async validateCurrencies(
    currencyCodes: (string | undefined)[] | undefined,
    sharedContext: Context
  ): Promise<void> {
    const normalizedCurrencyCodes = currencyCodes
      ?.filter((c) => c !== undefined)
      .map((c) => c!.toLowerCase())

    if (!normalizedCurrencyCodes || !normalizedCurrencyCodes.length) {
      return
    }

    const uniqueCurrencyCodes = Array.from(new Set(normalizedCurrencyCodes))
    const dbCurrencies = await this.currencyService_.list(
      { code: uniqueCurrencyCodes },
      {},
      sharedContext
    )
    const dbCurrencyCodes = dbCurrencies.map((c) => c.code.toLowerCase())

    if (uniqueCurrencyCodes.length !== dbCurrencyCodes.length) {
      const missingCurrencies = arrayDifference(
        uniqueCurrencyCodes,
        dbCurrencyCodes
      )

      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Currencies with codes: "${missingCurrencies.join(
          ", "
        )}" were not found`
      )
    }
  }

  @InjectTransactionManager("baseRepository_")
  private async validateCountries(
    countries: string[] | undefined,
    sharedContext: Context
  ): Promise<TCountry[]> {
    if (!countries || !countries.length) {
      return []
    }

    // The new regions being created have a country conflict
    const uniqueCountries = Array.from(new Set(countries))
    if (uniqueCountries.length !== countries.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Countries with codes: "${getDuplicateEntries(countries).join(
          ", "
        )}" are already assigned to a region`
      )
    }

    const countriesInDb = await this.countryService_.list(
      { iso_2: uniqueCountries },
      { select: ["iso_2", "region_id"] },
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
    if (countriesWithRegion.length > 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Countries with codes: "${countriesWithRegion
          .map((c) => c.iso_2)
          .join(", ")}" are already assigned to a region`
      )
    }

    return countriesInDb
  }

  @InjectManager("baseRepository_")
  public async createDefaultCountriesAndCurrencies(
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await promiseAll([
      await this.maybeCreateCountries(sharedContext),
      await this.maybeCreateCurrencies(sharedContext),
    ])
  }

  @InjectTransactionManager("baseRepository_")
  private async maybeCreateCountries(
    @MedusaContext() sharedContext: Context
  ): Promise<void> {
    const [countries, count] = await this.countryService_.listAndCount(
      {},
      { select: ["iso_2"], take: COUNTRIES_LIMIT },
      sharedContext
    )

    let countsToCreate: CreateCountryDTO[] = []
    if (count !== DefaultsUtils.defaultCountries.length) {
      const countriesInDb = new Set(countries.map((c) => c.iso_2))

      const countriesToAdd = DefaultsUtils.defaultCountries.filter(
        (c) => !countriesInDb.has(c.alpha2.toLowerCase())
      )

      countsToCreate = countriesToAdd.map((c) => ({
        iso_2: c.alpha2.toLowerCase(),
        iso_3: c.alpha3.toLowerCase(),
        num_code: c.numeric,
        name: c.name.toUpperCase(),
        display_name: c.name,
      }))
    }

    if (countsToCreate.length) {
      await this.countryService_.create(countsToCreate, sharedContext)
    }
  }

  @InjectTransactionManager("baseRepository_")
  private async maybeCreateCurrencies(
    @MedusaContext() sharedContext: Context
  ): Promise<void> {
    const [currency] = await this.currencyService_.list(
      {},
      { select: ["code"], take: 1 },
      sharedContext
    )

    let currsToCreate: CreateCurrencyDTO[] = []
    if (!currency) {
      currsToCreate = Object.entries(DefaultsUtils.defaultCurrencies).map(
        ([code, currency]) => ({
          code: code.toLowerCase(),
          symbol: currency.symbol,
          symbol_native: currency.symbol_native,
          name: currency.name,
        })
      )
    }

    if (currsToCreate.length) {
      await this.currencyService_.create(currsToCreate, sharedContext)
    }
  }
}

// microORM complains if undefined fields are present in the passed data object
const removeUndefined = <T extends Record<string, any>>(obj: T): T => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  ) as T
}

const asMap = <T extends Record<string, any>>(
  collection: T[],
  key: keyof T
) => {
  return collection.reduce((acc, item) => {
    acc[item[key]] = item
    return acc
  }, {} as Record<keyof T, T>)
}

const getDuplicateEntries = (collection: string[]): string[] => {
  const uniqueElements = new Set()
  const duplicates: string[] = []

  collection.forEach((item) => {
    if (uniqueElements.has(item)) {
      duplicates.push(item)
    } else {
      uniqueElements.add(item)
    }
  })

  return duplicates
}
