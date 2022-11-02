import {
  IsObject,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator"

import { EntityManager } from "typeorm"
import { PaymentCollectionType } from "../../../../models"
import { PaymentCollectionService } from "../../../../services"

export default async (req, res) => {
  const data = req.validatedBody as AdminCreatePaymentCollectionRequest
  const loggedInUserId = (req.user?.id ?? req.user?.userId) as string

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const payment_collection = await manager.transaction(
    async (transactionManager) => {
      return await paymentCollectionService
        .withTransaction(transactionManager)
        .create({
          ...data,
          created_by: loggedInUserId,
        })
    }
  )

  res.status(200).json({ payment_collection })
}

export class AdminCreatePaymentCollectionRequest {
  @IsString()
  region_id: string

  @IsString()
  currency_code: string

  @IsInt()
  @IsNotEmpty()
  amount: number

  @IsEnum(PaymentCollectionType)
  type: PaymentCollectionType

  @IsString()
  @IsOptional()
  description?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
