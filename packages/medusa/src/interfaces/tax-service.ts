import { BaseService } from "medusa-interfaces"

import { LineItem } from "../models/line-item"
import { Region } from "../models/region"
import { Address } from "../models/address"
import { ShippingMethod } from "../models/shipping-method"
import { Customer } from "../models/customer"
import { ProviderTaxLine, TaxServiceRate } from "../types/tax-service"
import { LineAllocationsMap } from "../types/totals"

/**
 * A shipping method and the tax rates that have been configured to apply to the
 * shipping method.
 */
export type ShippingTaxCalculationLine = {
  shipping_method: ShippingMethod
  rates: TaxServiceRate[]
}

/**
 * A line item and the tax rates that have been configured to apply to the
 * product contained in the line item.
 */
export type ItemTaxCalculationLine = {
  item: LineItem
  rates: TaxServiceRate[]
}

/**
 * Information relevant to a tax calculation, such as the shipping address where
 * the items are going.
 */
export type TaxCalculationContext = {
  shipping_address: Address | null
  customer: Customer
  region: Region
  is_return: boolean
  shipping_methods: ShippingMethod[]
  allocation_map: LineAllocationsMap
}

/**
 * Interface to be implemented by tax provider plugins. The interface defines a
 * single method `getTaxLines` that returns numerical rates to apply to line
 * items and shipping methods.
 */
export interface ITaxService {
  /**
   * Retrieves the numerical tax lines for a calculation context.
   * @param itemLines - the line item calculation lines
   * @param itemLines - the shipping calculation lines
   * @param context - other details relevant to the tax determination
   * @return numerical tax rates that should apply to the provided calculation
   *   lines
   */
  getTaxLines(
    itemLines: ItemTaxCalculationLine[],
    shippingLines: ShippingTaxCalculationLine[],
    context: TaxCalculationContext
  ): Promise<ProviderTaxLine[]>
}

export abstract class AbstractTaxService
  extends BaseService
  implements ITaxService
{
  protected static identifier: string

  public getIdentifier(): string {
    if (!(this.constructor as typeof AbstractTaxService).identifier) {
      throw new Error(`Missing static property "identifier".`)
    }
    return (this.constructor as typeof AbstractTaxService).identifier
  }

  public abstract getTaxLines(
    itemLines: ItemTaxCalculationLine[],
    shippingLines: ShippingTaxCalculationLine[],
    context: TaxCalculationContext
  ): Promise<ProviderTaxLine[]>
}
