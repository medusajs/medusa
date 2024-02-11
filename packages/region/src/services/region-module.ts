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
  RegionCurrencyDTO,
  RegionDTO,
  UpdatableRegionFields,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
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
    let currencies = await this.currencyService_.list(
      { code: data.map((d) => d.currency_code.toLowerCase()) },
      {},
      sharedContext
    )

    let currencyMap = new Map(currencies.map((c) => [c.code.toLowerCase(), c]))
    for (const reg of data) {
      const lowerCasedCurrency = reg.currency_code.toLowerCase()
      if (!currencyMap.has(lowerCasedCurrency)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Currency with code: ${reg.currency_code} was not found`
        )
      }

      reg.currency_code = lowerCasedCurrency
    }

    const result = await this.regionService_.create(data, sharedContext)

    return result
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
  @InjectTransactionManager("baseRepository_")
  async update(
    idOrSelector: string | FilterableRegionProps,
    data: UpdatableRegionFields,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<RegionDTO | RegionDTO[]> {
    let updateData: {
      selector?: FilterableRegionProps
      data?: UpdatableRegionFields
    } = {}
    if (isString(idOrSelector)) {
      updateData = { selector: { id: idOrSelector }, data }
    } else {
      updateData = {
        selector: idOrSelector,
        data,
      }
    }
    const result = await this.regionService_.update(updateData, sharedContext)

    return await this.baseRepository_.serialize<RegionDTO[] | RegionDTO>(result)
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
