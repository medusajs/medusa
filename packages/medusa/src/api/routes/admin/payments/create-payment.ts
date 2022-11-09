import { IsObject, IsInt, IsNotEmpty, IsString } from "class-validator"

import { EntityManager } from "typeorm"
import { PaymentService } from "../../../../services"
import { PaymentDataInput } from "../../../../services/payment"

export default async (req, res) => {
  const data = req.validatedBody as AdminCreatePaymentRequest

  const paymentService: PaymentService = req.scope.resolve("paymentService")

  const manager: EntityManager = req.scope.resolve("manager")

  const input: PaymentDataInput = {
    provider_id: data.provider_id,
    currency_code: data.currency_code,
    amount: data.amount,
    data: data.data,
  }

  const payment = await manager.transaction(async (transactionManager) => {
    return await paymentService
      .withTransaction(transactionManager)
      .create(input)
  })

  res.status(200).json({ payment })
}

export class AdminCreatePaymentRequest {
  @IsString()
  provider_id: string

  @IsString()
  currency_code: string

  @IsInt()
  @IsNotEmpty()
  amount: number

  @IsObject()
  data: Record<string, unknown>
}
