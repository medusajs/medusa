import { DALUtils } from "@medusajs/utils"
import { Order } from "@models"
import { setFindMethods } from "../utils/base-repository-find"

export class OrderRepository extends DALUtils.mikroOrmBaseRepositoryFactory<Order>(
  Order
) {}

setFindMethods(OrderRepository, Order)
