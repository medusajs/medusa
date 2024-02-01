import { AuthenticationInput, IAuthModuleService } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

import { MedusaError } from "@medusajs/utils"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { scope, authProvider } = req.params

  const service: IAuthModuleService = req.scope.resolve(
    ModuleRegistrationName.AUTH
  )

  const authData = { ...req } as unknown as AuthenticationInput
  authData.authScope = scope

  const authResult = await service.validateCallback(authProvider, authData)

  const { success, error, authUser, location } = authResult
  if (location) {
    res.redirect(location)
    return
  }

  if (!success && error) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, error)
  } else if (success) {
    req.session.auth_user = authUser
    req.session.scope = authUser.scope

    res.status(200).json({ authUser })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  await GET(req, res)
}
