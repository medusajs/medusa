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

  const { success, error, authUser, location, successRedirectUrl } = authResult
  if (location) {
    res.redirect(location)
    return
  }

  if (success) {
    const { jwt_secret } = req.scope.resolve("configModule").projectConfig

    const user = { ...authUser }
    const token = jwt.sign(user, jwt_secret)

    if (successRedirectUrl) {
      const url = new URL(successRedirectUrl!)
      url.searchParams.append("auth_token", token)

      const redirectUrl = `${url}`

      return res.redirect(redirectUrl.toString())
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
