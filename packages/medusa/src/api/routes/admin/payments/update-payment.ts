import { IsOptional, IsString } from "class-validator"

import { EntityManager } from "typeorm"
import { PaymentService } from "../../../../services"

export default async (req, res) => {
  const { id } = req.params
  const data = req.validatedBody as AdminUpdatePaymentRequest

  const paymentService: PaymentService = req.scope.resolve("paymentService")

  const manager: EntityManager = req.scope.resolve("manager")

  const paymentData = {
    order_id: data.order_id,
    swap_id: data.swap_id,
  }
  const payment = await manager.transaction(async (transactionManager) => {
    return await paymentService
      .withTransaction(transactionManager)
      .update(id, paymentData)
  })

  res.status(200).json({ payment_collection: payment })
}

export class AdminUpdatePaymentRequest {
  @IsString()
  @IsOptional()
  order_id?: string

  @IsString()
  @IsOptional()
  swap_id?: string
}
