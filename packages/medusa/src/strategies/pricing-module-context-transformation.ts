import { AbstractPricingModuleContextTransformer } from "../interfaces/pricing-module-context"
import { PriceSelectionContext } from "../interfaces"
import { EntityManager } from "typeorm"

// eslint-disable-next-line max-len
class PricingModuleContextTransformation extends AbstractPricingModuleContextTransformer {
  protected manager_: EntityManager

  constructor() {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
  }

  public async transformContext(
    context: PriceSelectionContext
  ): Promise<Record<string, any>> {
    return context
  }
}

export default PricingModuleContextTransformation
