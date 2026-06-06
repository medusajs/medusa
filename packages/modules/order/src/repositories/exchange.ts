import { DALUtils } from "@zjedene-medusa/framework/utils"
import { OrderExchange } from "@models"
import { setFindMethods } from "../utils/base-repository-find"

export class OrderExchangeRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  OrderExchange
) {}

setFindMethods(OrderExchangeRepository, OrderExchange)
