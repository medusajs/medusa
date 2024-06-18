import { DALUtils } from "@medusajs/utils"
import { OrderClaim } from "@models"
import { setFindMethods } from "../utils/base-repository-find"

export class OrderClaimRepository extends DALUtils.mikroOrmBaseRepositoryFactory<OrderClaim>(
  OrderClaim
) {}

setFindMethods(OrderClaimRepository, OrderClaim)
