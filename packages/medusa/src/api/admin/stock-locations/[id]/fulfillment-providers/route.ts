import { batchLinksWorkflow } from "@zjedene-medusa/core-flows"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"

import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { refetchStockLocation } from "../../helpers"

const buildLinks = (id, fulfillmentProviderIds: string[]) => {
  return fulfillmentProviderIds.map((fulfillmentProviderId) => ({
    [Modules.STOCK_LOCATION]: { stock_location_id: id },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: fulfillmentProviderId,
    },
  }))
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminBatchLink,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.AdminStockLocationResponse>
) => {
  const { id } = req.params
  const { add = [], remove = [] } = req.validatedBody

  await batchLinksWorkflow(req.scope).run({
    input: {
      create: buildLinks(id, add),
      delete: buildLinks(id, remove),
    },
  })

  const stockLocation = await refetchStockLocation(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ stock_location: stockLocation })
}
