import { ModuleRegistrationName } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params

  // NOTE: Consider replacing with remoteQuery when possible
  const orderModuleService = req.scope.resolve(ModuleRegistrationName.ORDER)

  const order = await orderModuleService.previewOrderChange(id)

  res.status(200).json({ order })
}
