import { HttpTypes } from "@zjedene-medusa/framework/types"
import { MedusaError } from "@zjedene-medusa/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@zjedene-medusa/framework/http"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.SelectParams>,
  res: MedusaResponse<HttpTypes.AdminExchangeResponse>
) => {
  const exchange = await refetchEntity({
    entity: "order_exchange",
    idOrFilter: req.params.id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  if (!exchange) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Exchange with id: ${req.params.id} was not found`
    )
  }

  res.status(200).json({ exchange })
}
