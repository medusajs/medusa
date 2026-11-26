import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  ConfigModule,
  HttpTypes,
  IAuthModuleService,
} from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { getAllowedAuthProvidersForActor } from "../../utils/auth-methods-per-actor"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse<HttpTypes.AuthProvidersListResponse>
) => {
  const { actor_type } = req.params

  const service: IAuthModuleService = req.scope.resolve(Modules.AUTH)
  const config: ConfigModule = req.scope.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const allowedProviderIds = getAllowedAuthProvidersForActor(config, actor_type)

  const providers = await service.listAuthProviders(
    allowedProviderIds ? { id: allowedProviderIds } : undefined
  )

  res.status(200).json({
    providers: providers.map((provider) => ({
      id: provider.id,
      identifier: provider.identifier,
      display_name: provider.display_name,
      flow: provider.flow,
    })),
  })
}
