import {
  AbstractTaxService,
  ItemTaxCalculationLine,
  ShippingTaxCalculationLine,
  TaxCalculationContext,
} from "../interfaces/tax-service"
import { ProviderTaxLine } from "../types/tax-service"

class SystemTaxService extends AbstractTaxService {
  static identifier = "system"

  constructor(...args: any[]) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
  }

  async getTaxLines(
    itemLines: ItemTaxCalculationLine[],
    shippingLines: ShippingTaxCalculationLine[],
    context: TaxCalculationContext // eslint-disable-line
  ): Promise<ProviderTaxLine[]> {
    let taxLines: ProviderTaxLine[] = itemLines.flatMap((l) => {
      return l.rates.map((r) => ({
        rate: r.rate || 0,
        name: r.name,
        code: r.code,
        item_id: l.item.id,
      }))
    })

    taxLines = taxLines.concat(
      shippingLines.flatMap((l) => {
        return l.rates.map((r) => ({
          rate: r.rate || 0,
          name: r.name,
          code: r.code,
          shipping_method_id: l.shipping_method.id,
        }))
      })
    )

    return taxLines
  }
}

export default SystemTaxService
