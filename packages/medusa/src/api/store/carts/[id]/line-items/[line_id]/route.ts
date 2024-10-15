import {
  deleteLineItemsWorkflow,
  updateLineItemInCartWorkflow,
} from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { prepareListQuery } from "@medusajs/framework"
import { refetchCart } from "../../../helpers"
import { StoreUpdateCartLineItemType } from "../../../validators"

export const POST = async (
  req: MedusaRequest<StoreUpdateCartLineItemType>,
  res: MedusaResponse<HttpTypes.StoreCartResponse>
) => {
  const cart = await refetchCart(
    req.params.id,
    req.scope,
    prepareListQuery(
      {},
      {
        defaults: [
          "id",
          "region_id",
          "customer_id",
          "sales_channel_id",
          "currency_code",
          "*items",
        ],
      }
    ).remoteQueryConfig.fields
  )

  const item = cart.items?.find((i) => i.id === req.params.line_id)
  if (!item) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Line item with id: ${req.params.line_id} was not found`
    )
  }

  const input = {
    cart,
    item,
    update: req.validatedBody,
  }

  await updateLineItemInCartWorkflow(req.scope).run({
    input,
  })

  const updatedCart = await refetchCart(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ cart: updatedCart })
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse<HttpTypes.StoreLineItemDeleteResponse>
) => {
  const id = req.params.line_id

  await deleteLineItemsWorkflow(req.scope).run({
    input: { cart_id: req.params.id, ids: [id] },
  })

  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({
    id: id,
    object: "line-item",
    deleted: true,
    parent: cart,
  })
}
