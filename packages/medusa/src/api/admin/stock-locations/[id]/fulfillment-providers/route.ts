import { batchLinksWorkflow } from "@medusajs/core-flows"
import { LinkMethodRequest } from "@medusajs/types"
import { Modules } from "@medusajs/utils"

import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
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
  req: AuthenticatedMedusaRequest<LinkMethodRequest>,
  res: MedusaResponse
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
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ stock_location: stockLocation })
}
