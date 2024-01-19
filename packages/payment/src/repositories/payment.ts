import { CreatePaymentDTO, UpdatePaymentDTO } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { Payment } from "@models"

export class PaymentRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  Payment,
  {
    create: CreatePaymentDTO
    update: UpdatePaymentDTO
  }
>(Payment) {}
