import { createPriceListPricesWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"
import { getPriceList } from "../../../../queries"
import {
  adminPriceListRemoteQueryFields,
  defaultAdminPriceListFields,
} from "../../../../query-config"
import { AdminPostPriceListsPriceListPricesBatchAddReq } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostPriceListsPriceListPricesBatchAddReq>,
  res: MedusaResponse
) => {
  const { prices } = req.validatedBody

  const id = req.params.id
  const workflow = createPriceListPricesWorkflow(req.scope)
  const { errors } = await workflow.run({
    input: { data: [{ id, prices }] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const priceList = await getPriceList({
    id,
    container: req.scope,
    remoteQueryFields: adminPriceListRemoteQueryFields,
    apiFields: defaultAdminPriceListFields,
  })

  res.status(200).json({ price_list: priceList })
}
