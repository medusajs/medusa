import { CreatePaymentSessionDTO } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { PaymentSession } from "@models"

export class PaymentSessionRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  PaymentSession,
  {
    create: CreatePaymentSessionDTO
  }
>(PaymentSession) {}
