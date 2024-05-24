import {
  deleteLineItemsWorkflow,
  updateLineItemInCartWorkflow,
} from "@medusajs/core-flows"
import { DeleteResponse } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../../../types/routing"
import { prepareListQuery } from "../../../../../../utils/get-query-config"
import { refetchCart } from "../../../helpers"
import { StoreUpdateCartLineItemType } from "../../../validators"

export const POST = async (
  req: MedusaRequest<StoreUpdateCartLineItemType>,
  res: MedusaResponse
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

  const { errors } = await updateLineItemInCartWorkflow(req.scope).run({
    input,
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const updatedCart = await refetchCart(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ cart: updatedCart })
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse<DeleteResponse<"line-item">>
) => {
  const id = req.params.line_id

  const { errors } = await deleteLineItemsWorkflow(req.scope).run({
    input: { cart_id: req.params.id, ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

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
