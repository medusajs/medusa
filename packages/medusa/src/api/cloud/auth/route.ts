import { MedusaRequest, MedusaResponse } from "@zjedene-medusa/framework"
import { ContainerRegistrationKeys } from "@zjedene-medusa/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const config = req.scope.resolve(ContainerRegistrationKeys.CONFIG_MODULE)

  res.status(200).json({
    enabled:
      !!config.projectConfig.http.authMethodsPerActor?.user?.includes("cloud"),
  })
}
