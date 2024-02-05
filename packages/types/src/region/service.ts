import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  FilterableRegionCountryProps,
  FilterableRegionCurrencyProps,
  FilterableRegionProps,
  RegionCountryDTO,
  RegionCurrencyDTO,
  RegionDTO,
} from "./common"
import { CreateRegionDTO, UpdateRegionDTO } from "./mutations"

export interface IRegionModuleService extends IModuleService {
  create(data: CreateRegionDTO[], sharedContext?: Context): Promise<RegionDTO[]>
  create(data: CreateRegionDTO, sharedContext?: Context): Promise<RegionDTO>

  update(data: UpdateRegionDTO[], sharedContext?: Context): Promise<RegionDTO[]>
  update(data: UpdateRegionDTO, sharedContext?: Context): Promise<RegionDTO>

  delete(ids: string[], sharedContext?: Context): Promise<void>
  delete(id: string, sharedContext?: Context): Promise<void>

  retrieve(
    id: string,
    config?: FindConfig<RegionDTO>,
    sharedContext?: Context
  ): Promise<RegionDTO>

  list(
    filters?: FilterableRegionProps,
    config?: FindConfig<RegionDTO>,
    sharedContext?: Context
  ): Promise<RegionDTO[]>

  listAndCount(
    filters?: FilterableRegionProps,
    config?: FindConfig<RegionDTO>,
    sharedContext?: Context
  ): Promise<[RegionDTO[], number]>

  retrieveCountry(
    countryId: string,
    config?: FindConfig<RegionCountryDTO>,
    sharedContext?: Context
  ): Promise<RegionCountryDTO>

  listCountries(
    filters?: FilterableRegionCountryProps,
    config?: FindConfig<RegionCountryDTO>,
    sharedContext?: Context
  ): Promise<RegionCountryDTO[]>

  retrieveCurrency(
    currencyId: string,
    config?: FindConfig<RegionCountryDTO>,
    sharedContext?: Context
  ): Promise<RegionCurrencyDTO>

  listAndCountCountries(
    filters?: FilterableRegionCountryProps,
    config?: FindConfig<RegionCountryDTO>,
    sharedContext?: Context
  ): Promise<[RegionCountryDTO[], number]>

  listCurrencies(
    filters?: FilterableRegionCurrencyProps,
    config?: FindConfig<RegionCurrencyDTO>,
    sharedContext?: Context
  ): Promise<RegionCurrencyDTO[]>

  listAndCountCurrencies(
    filters?: FilterableRegionCurrencyProps,
    config?: FindConfig<RegionCurrencyDTO>,
    sharedContext?: Context
  ): Promise<[RegionCurrencyDTO[], number]>

  softDelete<TReturnableLinkableKeys extends string = string>(
    regionIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  restore<TReturnableLinkableKeys extends string = string>(
    regionIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  createDefaultCountriesAndCurrencies(sharedContext?: Context): Promise<void>
}
