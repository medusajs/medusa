import { ITaxProvider, TaxTypes } from "@medusajs/framework/types"

export class TaxDataProviderService implements ITaxProvider {
  static identifier = "tax-data-provider"

  getIdentifier(): string {
    return TaxDataProviderService.identifier
  }

  async getTaxLines(
    itemLines: TaxTypes.ItemTaxCalculationLine[],
    shippingLines: TaxTypes.ShippingTaxCalculationLine[],
    _: TaxTypes.TaxCalculationContext
  ): Promise<(TaxTypes.ItemTaxLineDTO | TaxTypes.ShippingTaxLineDTO)[]> {
    const taxLines: (TaxTypes.ItemTaxLineDTO | TaxTypes.ShippingTaxLineDTO)[] =
      itemLines.flatMap((l) =>
        l.rates.map((r) => ({
          rate_id: r.id,
          rate: r.rate || 0,
          name: r.name,
          code: r.code,
          line_item_id: l.line_item.id,
          provider_id: this.getIdentifier(),
          data: {
            state_rate: 4.0,
            county_rate: 3.0,
            city_rate: 1.9,
          },
        }))
      )

    return taxLines.concat(
      shippingLines.flatMap((l) =>
        l.rates.map((r) => ({
          rate_id: r.id,
          rate: r.rate || 0,
          name: r.name,
          code: r.code,
          shipping_line_id: l.shipping_line.id,
          provider_id: this.getIdentifier(),
          data: {
            state_rate: 4.0,
            county_rate: 3.0,
            city_rate: 1.9,
          },
        }))
      )
    )
  }
}
