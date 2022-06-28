import { Request } from "express"
import { TotalsService } from "../../../../services"
import { Cart, LineItem } from "../../../../models"

export const decorateLineItemsWithTotals = async (
  cart: Cart,
  req: Request,
  options: { force_taxes: boolean } = { force_taxes: false }
): Promise<Cart> => {
  const totalsService: TotalsService = req.scope.resolve("totalsService")

  if (cart.items && cart.region) {
    const items = await Promise.all(
      cart.items.map(async (item: LineItem) => {
        const itemTotals = await totalsService.getLineItemTotals(item, cart, {
          include_tax: options.force_taxes || cart.region.automatic_taxes,
        })

        return Object.assign(item, itemTotals)
      })
    )

    return Object.assign(cart, { items })
  }

  return cart
}
