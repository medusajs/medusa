import { LineItem } from "../models/line-item"
import { Region } from "../models/region"
import { Address } from "../models/address"
import { ShippingMethod } from "../models/shipping-method"
import { Customer } from "../models/customer"
import { ProviderTaxLine, TaxServiceRate } from "../types/tax-service"
import { LineAllocationsMap } from "../types/totals"

export type TaxCalculationLine = {
  item: LineItem
  rates: TaxServiceRate[]
}

export type TaxCalculationContext = {
  shipping_address: Address | null
  customer: Customer
  region: Region
  shipping_methods: ShippingMethod[] | null
  allocation_map: LineAllocationsMap
}

export interface ITaxService {
  getTaxLines(
    lines: TaxCalculationLine[],
    context: TaxCalculationContext
  ): Promise<ProviderTaxLine[]>
}
