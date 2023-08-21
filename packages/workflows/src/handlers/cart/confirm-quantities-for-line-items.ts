import { CartWorkflow } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { WorkflowArguments } from "../../helper"

enum Aliases {
  LineItems = "line_items",
  Cart = "cart",
}

type HandlerInputData = {
  line_items?: CartWorkflow.CreateLineItemInputDTO[]
  cart: {
    id: string
    customer_id: string
    region_id: string
    sales_channel_id: string
  }
}


export async function confirmQuantitiesForLineItems({
  container,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<void> {
  const productVariantInventoryService = container.resolve("productVariantInventoryService")

  let lineItems = data[Aliases.LineItems] || []
  const cart = data[Aliases.Cart]

  for (const item of lineItems) {
    if (item.variant_id) {
      const isSufficient =
        await productVariantInventoryService.confirmInventory(
          item.variant_id,
          item.quantity,
          { salesChannelId: cart.sales_channel_id }
        )

      if (!isSufficient) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Variant with id: ${item.variant_id} does not have the required inventory.`,
          MedusaError.Codes.INSUFFICIENT_INVENTORY
        )
      }
    }
  }
}

confirmQuantitiesForLineItems.aliases = Aliases
