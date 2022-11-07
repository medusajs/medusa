import { PaymentCollectionService } from "../../../../services"

export default async (req, res) => {
  const { payment_id } = req.params

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  const payment = await paymentCollectionService.capture(payment_id)

  res.status(200).json({ payment })
}
