import { listShippingOptionsForCartWorkflow } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICartModuleService } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { MedusaError } from "@medusajs/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { cart_id } = req.filterableFields as { cart_id: string }
  if (!cart_id) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "You must provide the cart_id to list shipping options"
    )
  }

  const cartService = req.scope.resolve<ICartModuleService>(
    ModuleRegistrationName.CART
  )

  const cart = await cartService.retrieve(cart_id, {
    select: [
      "id",
      "sales_channel_id",
      "currency_code",
      "shipping_address.city",
      "shipping_address.country_code",
      "shipping_address.province",
    ],
    relations: ["shipping_address"],
  })

  const { result, errors } = await listShippingOptionsForCartWorkflow(
    req.scope
  ).run({
    throwOnError: false,
    input: {
      cart_id: cart.id,
      sales_channel_id: cart.sales_channel_id,
      currency_code: cart.currency_code,
      shipping_address: {
        city: cart.shipping_address?.city,
        country_code: cart.shipping_address?.country_code,
        province: cart.shipping_address?.province,
      },
    },
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.json({ shipping_options: result })
}
