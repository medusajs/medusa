import { ITransactionBaseService } from "@medusajs/types"
import { PriceSelectionContext } from "./price-selection-strategy"
import { TransactionBaseService } from "./transaction-base-service"

export interface IPricingModuleContextTransformer
  extends ITransactionBaseService {
  transformContext(context: PriceSelectionContext): Promise<Record<string, any>>
}

export abstract class AbstractPricingModuleContextTransformer
  extends TransactionBaseService
  implements IPricingModuleContextTransformer
{
  public abstract transformContext(
    context: PriceSelectionContext
  ): Promise<Record<string, any>>
}

export function isPricingModuleContextTransformer(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): object is IPricingModuleContextTransformer {
  return typeof object.transformContext === "function"
}
