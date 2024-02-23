import { FindConfig } from "../common"
import { SoftDeleteReturn } from "../dal"
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

  delete(taxRateIds: string[], sharedContext?: Context): Promise<void>
  delete(taxRateId: string, sharedContext?: Context): Promise<void>

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
    taxRateRulePair: { tax_rate_id: string; reference_id: string },
    sharedContext?: Context
  ): Promise<void>
  deleteTaxRateRules(
    taxRateRulePair: { tax_rate_id: string; reference_id: string }[],
    sharedContext?: Context
  ): Promise<void>

  listTaxRateRules(
    filters?: FilterableTaxRateRuleProps,
    config?: FindConfig<TaxRateRuleDTO>,
    sharedContext?: Context
  ): Promise<TaxRateRuleDTO[]>

  getTaxLines(
    item: (TaxableItemDTO | TaxableShippingDTO)[],
    calculationContext: TaxCalculationContext,
    sharedContext?: Context
  ): Promise<(ItemTaxLineDTO | ShippingTaxLineDTO)[]>
}
