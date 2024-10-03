import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { AdminGetPaymentParamsType } from "../validators"
import { refetchPayment } from "../helpers"
import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetPaymentParamsType>,
  res: MedusaResponse<HttpTypes.AdminPaymentResponse>
) => {
  const payment = await refetchPayment(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ payment })
}
