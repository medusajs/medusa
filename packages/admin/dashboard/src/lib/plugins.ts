import { HttpTypes } from "@zjedene-medusa/types"

export const LOYALTY_PLUGIN_NAME = "@zjedene-medusa/loyalty-plugin"

export const getLoyaltyPlugin = (plugins: HttpTypes.AdminPlugin[]) => {
  return plugins?.find((plugin) => plugin.name === LOYALTY_PLUGIN_NAME)
}
