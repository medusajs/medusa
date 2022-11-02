import { PaymentCollectionService } from "../../../../services"

export default async (req, res) => {
  const { id } = req.params

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  const payments = await paymentCollectionService.captureAll(id)

  res.status(200).json({ payments })
}
