import { AuthenticationInput, IAuthModuleService } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

import { MedusaError } from "@medusajs/utils"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { RouteConfig } from "../../../../loaders/helpers/routing/types"

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

  const authResult = await service.authenticate(authProvider, authData)

  const { success, error, authUser, location } = authResult
  if (location) {
    res.status(302)
    res.setHeader("Location", location)
    res.setHeader("Content-Length", "0")
    res.end()
    return
  }

  if (success) {
    req.session.auth_user = authUser
    req.session.scope = authUser.scope

    return res.status(200).json({ authUser })
  }

  throw new MedusaError(
    MedusaError.Types.UNAUTHORIZED,
    error || "Authentication failed"
  )
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  await GET(req, res)
}

// export const config: RouteConfig = {
//   shouldAppendStoreCors: true,
// }
