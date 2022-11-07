import { IsInt, IsNotEmpty, IsString } from "class-validator"

import { EntityManager } from "typeorm"
import { PaymentCollectionService } from "../../../../services"

export default async (req, res) => {
  const data = req.validatedBody as AdminRefreshPaymentCollectionSessionRequest
  const { id, session_id } = req.params

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const paymentCollection = await manager.transaction(
    async (transactionManager) => {
      return await paymentCollectionService
        .withTransaction(transactionManager)
        .refreshPaymentSession(id, session_id, data)
    }
  )

  res.status(200).json({ payment_collection: paymentCollection })
}

export class AdminRefreshPaymentCollectionSessionRequest {
  @IsString()
  provider_id: string

  @IsString()
  customer_id: string
}
