import { addProductsToSalesChannelsWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"

import { refetchSalesChannel } from "../../../../helpers"
import { AdminSetSalesChannelProductsBatchType } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminSetSalesChannelProductsBatchType>,
  res: MedusaResponse
) => {
  const workflowInput = {
    data: [
      {
        sales_channel_id: req.params.id,
        product_ids: req.validatedBody.product_ids,
      },
    ],
  }

  const { errors } = await addProductsToSalesChannelsWorkflow(req.scope).run({
    input: workflowInput,
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const salesChannel = await refetchSalesChannel(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ sales_channel: salesChannel })
}
