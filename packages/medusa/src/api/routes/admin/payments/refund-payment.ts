import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator"
import { RefundReason } from "../../../../models"

import { PaymentService } from "../../../../services"

export default async (req, res) => {
  const { id } = req.params

  const data = req.validatedBody as AdminPostPaymentRefundsReq

  const paymentService: PaymentService = req.scope.resolve("paymentService")

  const refund = await paymentService.refund(
    id,
    data.amount,
    data.reason,
    data.note
  )

  res.status(200).json({ refund })
}

export class AdminPostPaymentRefundsReq {
  @IsInt()
  @IsNotEmpty()
  amount: number

  @IsEnum(RefundReason)
  @IsNotEmpty()
  reason: RefundReason

  @IsString()
  @IsOptional()
  note?: string
}
