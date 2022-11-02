import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator"

import { PaymentCollectionService } from "../../../../services"
import { validator } from "../../../../utils/validator"

export default async (req, res) => {
  const { payment_id } = req.params

  const validated = (await validator(
    AdminPostPaymentCollectionRefundsReq,
    req.body
  )) as AdminPostPaymentCollectionRefundsReq

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  const payments = await paymentCollectionService.refund(
    payment_id,
    validated.amount,
    validated.reason,
    validated.note
  )

  res.status(200).json({ payments })
}

export class AdminPostPaymentCollectionRefundsReq {
  @IsInt()
  @IsNotEmpty()
  amount: number

  @IsString()
  @IsNotEmpty()
  reason: string

  @IsString()
  @IsOptional()
  note?: string
}
