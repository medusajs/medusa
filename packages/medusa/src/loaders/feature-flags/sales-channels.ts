import { FlagSettings } from "@medusajs/framework"

const SalesChannelFeatureFlag: FlagSettings = {
  key: "sales_channels",
  default_val: true,
  env_key: "MEDUSA_FF_SALES_CHANNELS",
  description: "[WIP] Enable the sales channels feature",
}

export default SalesChannelFeatureFlag
