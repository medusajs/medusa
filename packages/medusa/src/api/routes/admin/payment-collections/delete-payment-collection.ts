import { PaymentCollectionService } from "../../../../services"

export default async (req, res) => {
  const { id } = req.params

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  const payment_collection = await paymentCollectionService.delete(id)

  res.status(200).json({ payment_collection })
}
