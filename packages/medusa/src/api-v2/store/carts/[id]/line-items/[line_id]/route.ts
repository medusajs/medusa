import {
  deleteLineItemsWorkflow,
  updateLineItemInCartWorkflow,
} from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICartModuleService } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../../../types/routing"
import { refetchCart } from "../../../helpers"
import { StoreUpdateCartLineItemType } from "../../../validators"

export const POST = async (
  req: MedusaRequest<StoreUpdateCartLineItemType>,
  res: MedusaResponse
) => {
  const cartModuleService = req.scope.resolve<ICartModuleService>(
    ModuleRegistrationName.CART
  )

  const cart = await cartModuleService.retrieve(req.params.id, {
    select: ["id", "region_id", "currency_code"],
    relations: ["region", "items", "items.variant_id"],
  })

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

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const id = req.params.line_id

  const { errors } = await deleteLineItemsWorkflow(req.scope).run({
    input: { ids: [id] },
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

  res.status(200).json({ cart })
}
