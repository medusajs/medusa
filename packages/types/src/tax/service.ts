import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { FilterableTaxRateProps, TaxRateDTO } from "./common"
import { CreateTaxRateDTO } from "./mutations"

export interface ITaxRateModuleService extends IModuleService {
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
}
