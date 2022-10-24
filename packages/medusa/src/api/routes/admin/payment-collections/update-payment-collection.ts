import { CreatePaymentCollectionInput } from "../../../../types/payment-collection"
import { IsObject, IsOptional, IsString } from "class-validator"

import { EntityManager } from "typeorm"
import { PaymentCollectionService } from "../../../../services"

export default async (req, res) => {
  const { id } = req.params
  const data = req.validatedBody as CreatePaymentCollectionInput

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const payment_collection = await manager.transaction(
    async (transactionManager) => {
      return await paymentCollectionService
        .withTransaction(transactionManager)
        .update(id, data)
    }
  )

  res.status(200).json({ payment_collection })
}

export class AdminUpdatePaymentCollectionRequest {
  @IsString()
  @IsOptional()
  description?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
