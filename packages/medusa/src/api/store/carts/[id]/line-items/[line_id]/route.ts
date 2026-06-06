import {
  deleteLineItemsWorkflowId,
  updateLineItemInCartWorkflowId,
} from "@zjedene-medusa/core-flows"
import { MedusaRequest, MedusaResponse } from "@zjedene-medusa/framework/http"
import { AdditionalData, HttpTypes } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { refetchCart } from "../../../helpers"

export const POST = async (
  req: MedusaRequest<
    HttpTypes.StoreUpdateCartLineItem & AdditionalData,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.StoreCartResponse>
) => {
  const we = req.scope.resolve(Modules.WORKFLOW_ENGINE)
  await we.run(updateLineItemInCartWorkflowId, {
    input: {
      cart_id: req.params.id,
      item_id: req.params.line_id,
      update: req.validatedBody,
      additional_data: req.validatedBody.additional_data,
    },
  })

  const updatedCart = await refetchCart(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ cart: updatedCart })
}

export const DELETE = async (
  req: MedusaRequest<{}, HttpTypes.SelectParams>,
  res: MedusaResponse<HttpTypes.StoreLineItemDeleteResponse>
) => {
  const id = req.params.line_id

  const we = req.scope.resolve(Modules.WORKFLOW_ENGINE)
  await we.run(deleteLineItemsWorkflowId, {
    input: {
      cart_id: req.params.id,
      ids: [id],
    },
  })

  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({
    id: id,
    object: "line-item",
    deleted: true,
    parent: cart,
  })
}
