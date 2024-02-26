import {
  ItemTaxLineDTO,
  ShippingTaxLineDTO,
  TaxCalculationContext,
  TaxRateDTO,
  TaxableItemDTO,
  TaxableShippingDTO,
} from "./common"

/**
 * A shipping method and the tax rates configured to apply to the
 * shipping method.
 */
export type ShippingTaxCalculationLine = {
  /**
   * The shipping method to calculate taxes for.
   */
  shipping_line: TaxableShippingDTO
  /**
   * The rates applicable on the shipping method.
   */
  rates: TaxRateDTO[]
}

/**
 * A line item and the tax rates configured to apply to the
 * product contained in the line item.
 */
export type ItemTaxCalculationLine = {
  /**
   * The line item to calculate taxes for.
   */
  line_item: TaxableItemDTO
  /**
   * The rates applicable on the item.
   */
  rates: TaxRateDTO[]
}

export interface ITaxProvider {
  getIdentifier(): string

  getTaxLines(
    itemLines: ItemTaxCalculationLine[],
    shippingLines: ShippingTaxCalculationLine[],
    context: TaxCalculationContext
  ): Promise<(ItemTaxLineDTO | ShippingTaxLineDTO)[]>
}
