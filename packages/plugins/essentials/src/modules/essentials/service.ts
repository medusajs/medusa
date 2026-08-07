import { MedusaService } from "@medusajs/framework/utils"
import { EssentialsFeature, EssentialsPluginOptions } from "../../types"

type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>

class EssentialsModuleService extends MedusaService({}) {
  private options: RequireFields<EssentialsPluginOptions, "features">

  constructor(
    dependencies: Record<string, unknown>,
    options: EssentialsPluginOptions = {}
  ) {
    super(dependencies, options)
    this.options = {
      features:
        options.features ??
        (process.env.MEDUSA_ESSENTIALS_FEATURES?.split(
          ","
        ) as EssentialsFeature[]) ??
        "all",
      storeName: options.storeName ?? process.env.MEDUSA_ESSENTIALS_STORE_NAME,
      senderEmail:
        options.senderEmail ?? process.env.MEDUSA_ESSENTIALS_SENDER_EMAIL,
    }
  }

  async isFeatureEnabled(feature: EssentialsFeature) {
    return (
      this.options.features === "all" || this.options.features.includes(feature)
    )
  }

  async getStoreName() {
    return this.options.storeName
  }

  async getSenderEmail() {
    return this.options.senderEmail
  }
}

export default EssentialsModuleService
