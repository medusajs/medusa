import { MedusaService } from "@medusajs/framework/utils";
import { LoyaltyPluginOptions } from "../../types";
import GiftCard from "./models/gift-card";

class LoyaltyModuleService extends MedusaService({
  GiftCard,
}) {
  private options_: LoyaltyPluginOptions

  constructor(dependencies: Record<string, unknown>, options: LoyaltyPluginOptions = {}) {
    super(...arguments)
    this.options_ = options
  }

  getOptions(): LoyaltyPluginOptions {
    return this.options_
  }
}

export default LoyaltyModuleService;
