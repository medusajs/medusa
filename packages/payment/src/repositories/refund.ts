import { DALUtils } from "@medusajs/utils"

import { Refund } from "@models"
import { CreateRefundDTO } from "@medusajs/types"

export class RefundRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  Refund,
  {
    create: CreateRefundDTO
  }
>(Refund) {}
