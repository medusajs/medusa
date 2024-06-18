import { DALUtils } from "@medusajs/utils"
import { OrderExchange } from "@models"
import { setFindMethods } from "../utils/base-repository-find"

export class OrderExchangeRepository extends DALUtils.mikroOrmBaseRepositoryFactory<OrderExchange>(
  OrderExchange
) {}

setFindMethods(OrderExchangeRepository, OrderExchange)
