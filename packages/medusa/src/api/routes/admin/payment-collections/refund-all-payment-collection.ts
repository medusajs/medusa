import { IsNotEmpty, IsOptional, IsString } from "class-validator"

import { PaymentCollectionService } from "../../../../services"
import { validator } from "../../../../utils/validator"

export default async (req, res) => {
  const { id } = req.params

  const validated = (await validator(
    AdminPostPaymentCollectionRefundAllReq,
    req.body
  )) as AdminPostPaymentCollectionRefundAllReq

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  const [refunds, failure] = await paymentCollectionService.refundAll(
    id,
    validated.reason,
    validated.note
  )

  res.status(200).json({ refunds, failure })
}

export class AdminPostPaymentCollectionRefundAllReq {
  @IsString()
  @IsNotEmpty()
  reason: string

  @IsString()
  @IsOptional()
  note?: string
}
