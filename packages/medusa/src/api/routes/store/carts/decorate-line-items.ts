import { Request } from "express"
import { TotalsService } from "../../../../services"
import { Cart, LineItem } from "../../../../models"

export const decorateLineItems = async (
  cart: Cart,
  req: Request
): Promise<Cart> => {
  const totalsService: TotalsService = req.scope.resolve("totalsService")

  if (cart.items && cart.region) {
    const items = await Promise.all(
      cart.items.map(async (item: LineItem) => {
        const itemTotals = await totalsService.getLineItemTotals(item, cart, {
          include_tax: true,
        })

        return Object.assign(item, itemTotals)
      })
    )

    return Object.assign(cart, { items })
  }

  return cart
}
