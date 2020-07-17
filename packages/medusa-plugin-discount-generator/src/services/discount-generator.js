import randomize from "randomatic"
import { BaseService } from "medusa-interfaces"

class DiscountGeneratorService extends BaseService {
  constructor({ discountService }) {
    super()

    this.discountService_ = discountService
  }

  async generateDiscount(dynamicDiscountCode) {
    const discount = await this.discountService_.retrieveByCode(dynamicDiscountCode)
    const data = {
      code: randomize("A0", 10)
    }
    return this.discountService_.createDynamicCode(discount._id, data)
  }
}

export default DiscountGeneratorService
