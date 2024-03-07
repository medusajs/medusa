import { ITaxProvider, TaxTypes } from "@medusajs/types"

export default class SystemTaxService implements ITaxProvider {
  static identifier = "system"

  getIdentifier(): string {
    return SystemTaxService.identifier
  }

  async getTaxLines(
    itemLines: TaxTypes.ItemTaxCalculationLine[],
    shippingLines: TaxTypes.ShippingTaxCalculationLine[],
    _: TaxTypes.TaxCalculationContext
  ): Promise<(TaxTypes.ItemTaxLineDTO | TaxTypes.ShippingTaxLineDTO)[]> {
    let taxLines: (TaxTypes.ItemTaxLineDTO | TaxTypes.ShippingTaxLineDTO)[] =
      itemLines.flatMap((l) => {
        return l.rates.map((r) => ({
          rate_id: r.id,
          rate: r.rate || 0,
          name: r.name,
          code: r.code,
          line_item_id: l.line_item.id,
          provider_id: this.getIdentifier(),
        }))
      })

    taxLines = taxLines.concat(
      shippingLines.flatMap((l) => {
        return l.rates.map((r) => ({
          rate_id: r.id,
          rate: r.rate || 0,
          name: r.name,
          code: r.code,
          shipping_line_id: l.shipping_line.id,
          provider_id: this.getIdentifier(),
        }))
      })
    )

    return taxLines
  }
}
