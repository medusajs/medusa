import { Request } from "express"
import { TotalsService } from "../../../../services"
import { Cart, LineItem } from "../../../../models"
import { EntityManager } from "typeorm";

export const decorateLineItemsWithTotals = async (
  cart: Cart,
  req: Request,
  options: { force_taxes: boolean } = { force_taxes: false }
): Promise<Cart> => {
  const totalsService: TotalsService = req.scope.resolve("totalsService")

  if (cart.items && cart.region) {
    const manager: EntityManager = req.scope.resolve("manager")
    const items = await manager.transaction(async (transactionManager) => {
      return await Promise.all(
        cart.items.map(async (item: LineItem) => {
          const itemTotals = await totalsService
            .withTransaction(transactionManager)
            .getLineItemTotals(item, cart, {
              include_tax: options.force_taxes || cart.region.automatic_taxes,
            })

          return Object.assign(item, itemTotals)
        })
      )
    })

    return Object.assign(cart, { items })
  }

  return cart
}
