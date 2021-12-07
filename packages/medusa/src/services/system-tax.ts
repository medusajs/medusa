import { BaseService } from "medusa-interfaces"

import {
  ITaxService,
  TaxCalculationLine,
  TaxCalculationContext,
} from "../interfaces/tax-service"
import { ProviderTaxLine } from "../types/tax-line"

class SystemTaxService extends BaseService implements ITaxService {
  static identifier = "system"

  constructor() {
    super()
  }

  async calculateLineItemTaxes(
    lines: TaxCalculationLine[],
    context: TaxCalculationContext // eslint-disable-line
  ): Promise<ProviderTaxLine[]> {
    return lines.flatMap((l) => {
      return l.rates.map((r) => ({
        rate: r.rate,
        name: r.name,
        code: r.code,
        item_id: l.item.id,
      }))
    })
  }
}

export default SystemTaxService
