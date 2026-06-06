import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { refetchPayment } from "../helpers"
import { HttpTypes } from "@zjedene-medusa/framework/types"

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
