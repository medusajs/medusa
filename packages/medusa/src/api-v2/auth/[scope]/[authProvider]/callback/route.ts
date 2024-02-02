import jwt from "jsonwebtoken"
import { MedusaError } from "@medusajs/utils"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { AuthenticationInput, IAuthModuleService } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { scope, authProvider } = req.params

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

  const authResult = await service.validateCallback(authProvider, authData)

  const { success, error, authUser, location } = authResult
  if (location) {
    res.redirect(location)
    return
  }

  if (success) {
    const { jwt_secret } = req.scope.resolve("configModule").projectConfig
    const token = jwt.sign(authUser, jwt_secret)
    return res.status(200).json({ token })
  }

  throw new MedusaError(
    MedusaError.Types.UNAUTHORIZED,
    error || "Authentication failed"
  )
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  await GET(req, res)
}
