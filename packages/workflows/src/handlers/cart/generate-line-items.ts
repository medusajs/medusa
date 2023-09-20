import { ProductTypes, ProductVariantDTO } from "@medusajs/types"
import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import { prepareLineItemData } from "@medusajs/utils"

import { WorkflowArguments } from "../../helper"

type HandlerInputData = {
  items: (Partial<ProductVariantDTO> & {
    quantity: number
    unit_price?: number
  })[]
  cart: {
    id: string
    customer_id: string
    region_id: string
  }
}

enum Aliases {
  items = "items",
  cart = "cart",
}

export async function generateLineItems({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<void> {
  const { manager } = context

  const { items, cart } = data

  const ids = items.map((i) => i!.id)

  const lineItemService = container.resolve("lineItemService")
  const lineItemServiceTx = lineItemService.withTransaction(manager)

  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName) // TODO: use the core service

  const variants = await productModuleService.listVariants({
    id: ids as string[],
  })

  return await lineItemServiceTx.generate(
    variants.map((variant) => {
      const item = items.find((i) => i.id === variant.id)!
      return prepareLineItemData(variant, item.quantity, item.unit_price)
    }),
    {
      region_id: cart.region_id,
      customer_id: cart.customer_id,
    }
  )
}

generateLineItems.aliases = Aliases
