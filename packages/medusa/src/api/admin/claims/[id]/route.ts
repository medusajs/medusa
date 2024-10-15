import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { AdminClaimResponse } from "@medusajs/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<AdminClaimResponse>
) => {
  const claim = await refetchEntity(
    "order_claim",
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  if (!claim) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Claim with id: ${req.params.id} was not found`
    )
  }

  res.status(200).json({ claim })
}
