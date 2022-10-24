import { IsNumber, IsOptional, IsString } from "class-validator"
import { IsType } from "../../../../utils/validators/is-type"

import { EntityManager } from "typeorm"
import { PaymentCollectionService } from "../../../../services"

export default async (req, res) => {
  const data = req.validatedBody as AdminManagePaymentCollectionSessionRequest
  const { id } = req.params

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const payment_collection = await manager.transaction(
    async (transactionManager) => {
      return await paymentCollectionService
        .withTransaction(transactionManager)
        .setPaymentSessions(id, data.sessions)
    }
  )

  res.status(200).json({ payment_collection })
}

export class PaymentCollectionSessionInputRequest {
  @IsString()
  provider_id: string

  @IsString()
  customer_id: string

  @IsNumber()
  amount: number

  @IsString()
  @IsOptional()
  session_id?: string
}

export class AdminManagePaymentCollectionSessionRequest {
  @IsType([
    PaymentCollectionSessionInputRequest,
    [PaymentCollectionSessionInputRequest],
  ])
  sessions:
    | PaymentCollectionSessionInputRequest
    | PaymentCollectionSessionInputRequest[]
}
