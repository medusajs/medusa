import { AuthenticatedMedusaRequest } from "@medusajs/framework"
import { IAuthModuleService } from "@medusajs/types"
import { MedusaError, ModuleRegistrationName } from "@medusajs/utils"
import { JwtPayload, verify } from "jsonwebtoken"
import { MedusaResponse } from "../../../../../types/routing"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { auth_provider } = req.params
  const { token } = req.query

  const authService = req.scope.resolve<IAuthModuleService>(
    ModuleRegistrationName.AUTH
  )

  if (token && !req.auth_context) {
    let verified: JwtPayload | null = null

    try {
      verified = verify(token as string, "secret") as JwtPayload
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!verified) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const providerIdentity = await authService.retrieveProviderIdentity(
      verified?.provider_identity_id,
      {
        select: ["entity_id"],
        relations: ["auth_identity"],
      }
    )

    if (!providerIdentity) {
      return res.status(401).json({ message: "Unauthorized" })
    }
  }

  const { success, error } = await authService.updateProvider(
    auth_provider,
    req.body as Record<string, unknown>
  )

  if (success) {
    return res.status(200).json({ success: true })
  }

  throw new MedusaError(MedusaError.Types.UNAUTHORIZED, error || "Unauthorized")
}
