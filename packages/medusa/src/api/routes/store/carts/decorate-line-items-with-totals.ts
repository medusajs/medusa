import { Request } from "express"
import { TotalsService } from "../../../../services"
import { Cart, LineItem } from "../../../../models"
import { EntityManager } from "typeorm";

export const decorateLineItemsWithTotals = async (
  cart: Cart,
  req: Request,
  options: { force_taxes: boolean, transactionManager?: EntityManager } = { force_taxes: false }
): Promise<Cart> => {
  const totalsService: TotalsService = req.scope.resolve("totalsService")

  if (cart.items && cart.region) {
    const getItems = async (manager) => {
      const totalsServiceTx = totalsService.withTransaction(manager)
      return await Promise.all(
        cart.items.map(async (item: LineItem) => {
          const itemTotals = await totalsServiceTx
            .getLineItemTotals(item, cart, {
              include_tax: options.force_taxes || cart.region.automatic_taxes,
            })

          return Object.assign(item, itemTotals)
        })
      )
    }

    let items
    if (options.transactionManager) {
      items = await getItems(options.transactionManager)
    } else {
      const manager: EntityManager = options.transactionManager ?? req.scope.resolve("manager")
      items = await manager.transaction(async (transactionManager) => {
        return await getItems(transactionManager)
      })
    }

    return Object.assign(cart, { items })
  }

  return cart
}
