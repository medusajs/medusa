import _ from "lodash"
import { BaseService } from "medusa-interfaces"

/**
 * A service that calculates total and subtotals for orders, carts etc..
 * @implements BaseService
 */
class TotalsService extends BaseService {
  cartSubTotal(cart) {
    let subTotal = 0
    if (!cart.items) {
      return subTotal
    }

    cart.items.map(item => {
      if (Array.isArray(item.content)) {
        const temp = _.sumBy(item.content, c => c.unit_price * c.quantity)
        subTotal += temp * item.quantity
      } else {
        subTotal +=
          item.content.unit_price * item.content.quantity * item.quantity
      }
    })
    return subTotal
  }
}

export default TotalsService
