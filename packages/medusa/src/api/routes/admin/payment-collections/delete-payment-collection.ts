import { PaymentCollectionService } from "../../../../services"

export default async (req, res) => {
  const { id } = req.params

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  await paymentCollectionService.delete(id)

  res.status(200).json({ id, deleted: true, object: "payment_collection" })
}
