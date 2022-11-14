import { PaymentCollectionService } from "../../../../services"
import { FindParams } from "../../../../types/common"

export default async (req, res) => {
  const { id } = req.params
  const retrieveConfig = req.retrieveConfig

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  const paymentCollection = await paymentCollectionService.retrieve(
    id,
    retrieveConfig
  )

  res.status(200).json({ payment_collection: paymentCollection })
}

export class GetPaymentCollectionsParams extends FindParams {}
