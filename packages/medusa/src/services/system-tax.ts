import { BaseService } from "medusa-interfaces"

import {
  ITaxService,
  TaxCalculationLine,
  TaxCalculationContext,
} from "../interfaces/tax-service"
import { ProviderTaxLine } from "../types/tax-service"

class SystemTaxService extends BaseService implements ITaxService {
  static identifier = "system"

  constructor() {
    super()
  }

  async getTaxLines(
    lines: TaxCalculationLine[],
    context: TaxCalculationContext // eslint-disable-line
  ): Promise<ProviderTaxLine[]> {
    return lines.flatMap((l) => {
      return l.rates.map((r) => ({
        rate: r.rate || 0,
        name: r.name,
        code: r.code,
        item_id: l.item.id,
      }))
    })
  }
}

export default SystemTaxService
