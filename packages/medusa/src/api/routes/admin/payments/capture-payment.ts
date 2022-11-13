import { PaymentService } from "../../../../services"

export default async (req, res) => {
  const { id } = req.params

  const paymentService: PaymentService = req.scope.resolve("paymentService")

  const payment = await paymentService.capture(id)

  res.status(200).json({ payment })
}
