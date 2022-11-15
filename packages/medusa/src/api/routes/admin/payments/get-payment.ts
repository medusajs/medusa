import { PaymentService } from "../../../../services"
import { FindParams } from "../../../../types/common"

export default async (req, res) => {
  const { id } = req.params
  const retrieveConfig = req.retrieveConfig

  const paymentService: PaymentService = req.scope.resolve("paymentService")

  const payment = await paymentService.retrieve(id, retrieveConfig)

  res.status(200).json({ payment: payment })
}

export class GetPaymentsParams extends FindParams {}
