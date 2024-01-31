import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { AuthenticationInput, IAuthModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { MedusaError } from "@medusajs/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { scope, authProvider } = req.params

  const service: IAuthModuleService = req.scope.resolve(
    ModuleRegistrationName.AUTH
  )

  const authData = { ...req } as unknown as AuthenticationInput
  authData.authScope = scope

  const authResult = await service.authenticate(authProvider, authData)

  const { success, error, authUser, location } = authResult
  if (location) {
    res.redirect(location)
  }

  if (!success && error) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, error)
  } else if (success) {
    req.session.authUser = authUser
    req.session.scope = authUser.app_metadata.scope

    res.status(200).json({ authUser })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  res.status(200).json({})
}
