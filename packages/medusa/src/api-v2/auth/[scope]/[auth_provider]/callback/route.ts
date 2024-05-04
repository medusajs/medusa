import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { AuthenticationInput, IAuthModuleService } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import jwt from "jsonwebtoken"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { scope, auth_provider } = req.params

  const service: IAuthModuleService = req.scope.resolve(
    ModuleRegistrationName.AUTH
  )

  const authData = {
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    authScope: scope,
    protocol: req.protocol,
  } as AuthenticationInput

  const authResult = await service.validateCallback(auth_provider, authData)

  const { success, error, authUser, successRedirectUrl } = authResult

  if (success) {
    const { jwt_secret } = req.scope.resolve("configModule").projectConfig

    const token = jwt.sign(authUser, jwt_secret)

    if (successRedirectUrl) {
      const url = new URL(successRedirectUrl!)
      url.searchParams.append("access_token", token)

      return res.redirect(url.toString())
    }

    return res.json({ token })
  }

  throw new MedusaError(
    MedusaError.Types.UNAUTHORIZED,
    error || "Authentication failed"
  )
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  await GET(req, res)
}
