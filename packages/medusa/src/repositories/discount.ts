import { EntityRepository, Repository } from "typeorm"
import { Discount } from "../models/discount"

@EntityRepository(Discount)
export class DiscountRepository extends Repository<Discount> {
  // canApply(discountId: string, customerId: string) {
  //     // list from customer_group_customers where customer_id = customerId
  // }
  // isValidForProduct(discountId: string, productId: string) {
  //     // list from product condition tables where product = productId
  // }
}
