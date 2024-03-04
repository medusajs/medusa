import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  FilterableTaxRegionProps,
  FilterableTaxRateProps,
  TaxRateDTO,
  TaxRegionDTO,
  TaxRateRuleDTO,
  FilterableTaxRateRuleProps,
  TaxableItemDTO,
  TaxCalculationContext,
  ItemTaxLineDTO,
  ShippingTaxLineDTO,
  TaxableShippingDTO,
} from "./common"
import {
  CreateTaxRateRuleDTO,
  CreateTaxRateDTO,
  CreateTaxRegionDTO,
  UpdateTaxRateDTO,
  UpsertTaxRateDTO,
} from "./mutations"

export interface ITaxModuleService extends IModuleService {
  retrieve(
    taxRateId: string,
    config?: FindConfig<TaxRateDTO>,
    sharedContext?: Context
  ): Promise<TaxRateDTO>

  list(
    filters?: FilterableTaxRateProps,
    config?: FindConfig<TaxRateDTO>,
    sharedContext?: Context
  ): Promise<TaxRateDTO[]>

  listAndCount(
    filters?: FilterableTaxRateProps,
    config?: FindConfig<TaxRateDTO>,
    sharedContext?: Context
  ): Promise<[TaxRateDTO[], number]>

  create(
    data: CreateTaxRateDTO[],
    sharedContext?: Context
  ): Promise<TaxRateDTO[]>
  create(data: CreateTaxRateDTO, sharedContext?: Context): Promise<TaxRateDTO>

  update(
    taxRateId: string,
    data: UpdateTaxRateDTO,
    sharedContext?: Context
  ): Promise<TaxRateDTO>
  update(
    taxRateIds: string[],
    data: UpdateTaxRateDTO,
    sharedContext?: Context
  ): Promise<TaxRateDTO[]>
  update(
    selector: FilterableTaxRateProps,
    data: UpdateTaxRateDTO,
    sharedContext?: Context
  ): Promise<TaxRateDTO[]>

  upsert(data: UpsertTaxRateDTO, sharedContext?: Context): Promise<TaxRateDTO>
  upsert(
    data: UpsertTaxRateDTO[],
    sharedContext?: Context
  ): Promise<TaxRateDTO[]>

  delete(taxRateIds: string[], sharedContext?: Context): Promise<void>
  delete(taxRateId: string, sharedContext?: Context): Promise<void>

  restore<TReturnableLinkableKeys extends string = string>(
    taxRateIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  createTaxRegions(
    data: CreateTaxRegionDTO,
    sharedContext?: Context
  ): Promise<TaxRegionDTO>
  createTaxRegions(
    data: CreateTaxRegionDTO[],
    sharedContext?: Context
  ): Promise<TaxRegionDTO[]>

  deleteTaxRegions(
    taxRegionIds: string[],
    sharedContext?: Context
  ): Promise<void>
  deleteTaxRegions(taxRegionId: string, sharedContext?: Context): Promise<void>

  listTaxRegions(
    filters?: FilterableTaxRegionProps,
    config?: FindConfig<TaxRegionDTO>,
    sharedContext?: Context
  ): Promise<TaxRegionDTO[]>

  createTaxRateRules(
    data: CreateTaxRateRuleDTO,
    sharedContext?: Context
  ): Promise<TaxRateRuleDTO>
  createTaxRateRules(
    data: CreateTaxRateRuleDTO[],
    sharedContext?: Context
  ): Promise<TaxRateRuleDTO[]>

  deleteTaxRateRules(
    taxRateRuleId: string,
    sharedContext?: Context
  ): Promise<void>
  deleteTaxRateRules(
    taxRateRuleIds: string[],
    sharedContext?: Context
  ): Promise<void>

  listTaxRateRules(
    filters?: FilterableTaxRateRuleProps,
    config?: FindConfig<TaxRateRuleDTO>,
    sharedContext?: Context
  ): Promise<TaxRateRuleDTO[]>

  getTaxLines(
    items: (TaxableItemDTO | TaxableShippingDTO)[],
    calculationContext: TaxCalculationContext,
    sharedContext?: Context
  ): Promise<(ItemTaxLineDTO | ShippingTaxLineDTO)[]>

  softDelete<TReturnableLinkableKeys extends string = string>(
    taxRateIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  softDeleteTaxRegions<TReturnableLinkableKeys extends string = string>(
    taxRegionIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  restoreTaxRegions<TReturnableLinkableKeys extends string = string>(
    taxRegionIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  softDeleteTaxRateRules<TReturnableLinkableKeys extends string = string>(
    taxRateRuleIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  restoreTaxRateRules<TReturnableLinkableKeys extends string = string>(
    taxRateRuleIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
}
