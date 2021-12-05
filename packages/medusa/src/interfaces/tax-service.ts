import { LineItem } from "../models/line-item"
import { Region } from "../models/region"
import { Address } from "../models/address"
import { Customer } from "../models/customer"
import { ProviderTaxLine } from "../types/tax-line"
import { TaxServiceRate } from "../types/tax-service"
import { LineAllocationsMap } from "../types/totals"

export type TaxCalculationLine = {
  item: LineItem
  rates: TaxServiceRate[]
}

export type TaxCalculationContext = {
  shipping_address: Address | null
  customer: Customer
  region: Region
  allocation_map: LineAllocationsMap
}

export interface ITaxService {
  calculateLineItemTaxes(
    lines: TaxCalculationLine[],
    context: TaxCalculationContext
  ): Promise<ProviderTaxLine[]>
}
