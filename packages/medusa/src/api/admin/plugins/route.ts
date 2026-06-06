import { MedusaRequest, MedusaResponse } from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import { ContainerRegistrationKeys, isString } from "@zjedene-medusa/framework/utils"

export const GET = async (
  req: MedusaRequest<unknown>,
  res: MedusaResponse<HttpTypes.AdminPluginsListResponse>
) => {
  const configModule = req.scope.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const configPlugins = configModule.plugins ?? []

  const plugins = configPlugins.map((plugin) => ({
    name: isString(plugin) ? plugin : plugin.resolve,
  }))

  res.json({
    plugins,
  })
}
