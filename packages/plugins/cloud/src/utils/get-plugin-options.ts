import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { CloudPluginOptions } from "../types"

const PLUGIN_NAME = "@medusajs/cloud"

export const getPluginOptions = (
  container: MedusaContainer
): CloudPluginOptions => {
  const { plugins } = container.resolve(ContainerRegistrationKeys.CONFIG_MODULE)
  const plugin = plugins.find(
    (p) => typeof p !== "string" && p.resolve === PLUGIN_NAME
  ) as { options?: CloudPluginOptions } | undefined

  return plugin?.options ?? {}
}
