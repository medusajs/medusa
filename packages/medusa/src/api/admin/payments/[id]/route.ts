import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { AdminGetPaymentParamsType } from "../validators"
import { refetchPayment } from "../helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetPaymentParamsType>,
  res: MedusaResponse
) => {
  const payment = await refetchPayment(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ payment })
}
