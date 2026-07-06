import { MedusaService } from "@medusajs/framework/utils"
import { LoyaltyPluginOptions } from "../../types"
import GiftCard from "./models/gift-card"

class LoyaltyModuleService extends MedusaService({
  GiftCard,
}) {
  private options_: LoyaltyPluginOptions

  constructor(
    dependencies: Record<string, unknown>,
    options: LoyaltyPluginOptions = {}
  ) {
    super(dependencies, options)
    this.options_ = options
  }
  async getOptions(): Promise<LoyaltyPluginOptions> {
    return this.options_
  }
}

export default LoyaltyModuleService
