import { DALUtils } from "@medusajs/framework/utils"
import { OrderClaim } from "@models"
import { setFindMethods } from "../utils/base-repository-find"

export class OrderClaimRepository extends DALUtils.mikroOrmBaseRepositoryFactory<OrderClaim>(
  OrderClaim
) {}

setFindMethods(OrderClaimRepository, OrderClaim)
