import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  FilterableTaxRegionProps,
  FilterableTaxRateProps,
  TaxRateDTO,
  TaxRegionDTO,
  ShippingTaxRateDTO,
  FilterableShippingTaxRateProps,
  ProductTaxRateDTO,
  FilterableProductTaxRateProps,
  ProductTypeTaxRateDTO,
  FilterableProductTypeTaxRateProps,
} from "./common"
import {
  CreateProductTaxRateDTO,
  CreateProductTypeTaxRateDTO,
  CreateShippingTaxRateDTO,
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
    data: CreateTaxRegionDTO[],
    sharedContext?: Context
  ): Promise<TaxRegionDTO[]>

  listTaxRegions(
    filters?: FilterableTaxRegionProps,
    config?: FindConfig<TaxRegionDTO>,
    sharedContext?: Context
  ): Promise<TaxRegionDTO[]>

  createShippingTaxRates(
    data: CreateShippingTaxRateDTO[],
    sharedContext?: Context
  ): Promise<ShippingTaxRateDTO[]>

  listShippingTaxRates(
    filters?: FilterableShippingTaxRateProps,
    config?: FindConfig<ShippingTaxRateDTO>,
    sharedContext?: Context
  ): Promise<ShippingTaxRateDTO[]>

  createProductTaxRates(
    data: CreateProductTaxRateDTO[],
    sharedContext?: Context
  ): Promise<ProductTaxRateDTO[]>

  listProductTaxRates(
    filters?: FilterableProductTaxRateProps,
    config?: FindConfig<ProductTaxRateDTO>,
    sharedContext?: Context
  ): Promise<ProductTaxRateDTO[]>

  createProductTypeTaxRates(
    data: CreateProductTypeTaxRateDTO[],
    sharedContext?: Context
  ): Promise<ProductTypeTaxRateDTO[]>

  listProductTypeTaxRates(
    filters?: FilterableProductTypeTaxRateProps,
    config?: FindConfig<ProductTypeTaxRateDTO>,
    sharedContext?: Context
  ): Promise<ProductTypeTaxRateDTO[]>
}
