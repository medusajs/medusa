import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: MedusaRequest<unknown>,
  res: MedusaResponse<HttpTypes.AdminModulesListResponse>
) => {
  const modules = MedusaModule.getModuleKeys().map((key) => ({ key }))

  res.json({
    modules,
  })
}
