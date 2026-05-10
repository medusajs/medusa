import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { refetchPayment } from "../helpers"
import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminGetPaymentParams>,
  res: MedusaResponse<HttpTypes.AdminPaymentResponse>
) => {
  const payment = await refetchPayment(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ payment })
}
