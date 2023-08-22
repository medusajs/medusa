import { MedusaError } from "@medusajs/utils"
import { WorkflowArguments } from "../../helper"

enum Aliases { 
  Cart= "cart",
  LineItems = "line_items",
}

export async function validateLineItemsForCart({
  container,
  context,
  data,
}: WorkflowArguments): Promise<void> {
  const { manager } = context
  const cartService = container.resolve("cartService")
  const cartServiceTx = cartService.withTransaction(manager)

  const cart = data[Aliases.Cart]
  const items = data[Aliases.LineItems]

  if(!items?.length){ 
    return 
  }
  
  const areValid = await Promise.all(
    items.map(async (item) => {
      if (item.variant_id) {
        return await cartServiceTx.validateLineItem(
          cart,
          item
        )
      }
      return true
    })
  )

  const invalidProducts = areValid
    .map((valid, index) => {
      return !valid ? { title: items[index].title } : undefined
    })
    .filter((v): v is { title: string } => !!v)

  if (invalidProducts.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `The products [${invalidProducts
        .map((item) => item.title)
        .join(
          " - "
        )}] must belong to the sales channel on which the cart has been created.`
    )
  }
}