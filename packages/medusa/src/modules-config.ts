import { MedusaModuleConfig, Modules } from "@medusajs/modules-sdk"

const modules: MedusaModuleConfig = {
  [Modules.PRODUCT]: true,
  [Modules.PRICING]: true,
}

export default modules
