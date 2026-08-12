import { MedusaService } from "@medusajs/framework/utils"
import { StarterKitFeature, StarterKitPluginOptions } from "../../types"

type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>

class StarterKitModuleService extends MedusaService({}) {
  private options: RequireFields<StarterKitPluginOptions, "features">

  constructor(
    dependencies: Record<string, unknown>,
    options: StarterKitPluginOptions = {}
  ) {
    super(dependencies, options)
    this.options = {
      features:
        options.features ??
        (process.env.MEDUSA_STARTER_KIT_FEATURES?.split(
          ","
        ) as StarterKitFeature[]) ??
        "all",
      storeName: options.storeName ?? process.env.MEDUSA_STARTER_KIT_STORE_NAME,
      senderEmail:
        options.senderEmail ?? process.env.MEDUSA_STARTER_KIT_SENDER_EMAIL,
    }
  }

  async isFeatureEnabled(feature: StarterKitFeature) {
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

export default StarterKitModuleService
