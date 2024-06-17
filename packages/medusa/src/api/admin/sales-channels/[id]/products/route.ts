import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

import { LinkMethodRequest } from "@medusajs/types/src"
import { refetchSalesChannel } from "../../helpers"
import { linkProductsToSalesChannelWorkflow } from "@medusajs/core-flows"

export const POST = async (
  req: AuthenticatedMedusaRequest<LinkMethodRequest>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { add, remove } = req.validatedBody

  const workflow = linkProductsToSalesChannelWorkflow(req.scope)
  await workflow.run({
    input: {
      id,
      add,
      remove,
    },
  })

  const salesChannel = await refetchSalesChannel(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ sales_channel: salesChannel })
}
