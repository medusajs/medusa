import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

/**
 * Provides layer to manipulate carts.
 * @implements BaseService
 */
class CounterService extends BaseService {
  constructor({ counterModel }) {
    super()

    /** @private @const {CartModel} */
    this.counterModel_ = counterModel
  }

  async createDefaults() {
    const orderCounter = await this.counterModel_.findOne({ _id: "orders" })
    if (!orderCounter) {
      await this.counterModel_.create({ _id: "orders", next: 1000 })
    }
  }

  async getNext(id) {
    const counter = await this.counterModel_.updateOne(
      { _id: id },
      { $inc: { next: 1 } }
    )
    return counter.next
  }
}

export default CounterService
