import { removePriceListPricesWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"
import { listPriceLists } from "../../../../queries"
import {
  adminPriceListRemoteQueryFields,
  defaultAdminPriceListFields,
} from "../../../../query-config"
import { AdminPostPriceListsPriceListPricesBatchRemoveReq } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostPriceListsPriceListPricesBatchRemoveReq>,
  res: MedusaResponse
) => {
  const { ids } = req.validatedBody
  const id = req.params.id
  const workflow = removePriceListPricesWorkflow(req.scope)
  const { errors } = await workflow.run({
    input: { ids },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const [[priceList]] = await listPriceLists({
    container: req.scope,
    remoteQueryFields: adminPriceListRemoteQueryFields,
    apiFields: defaultAdminPriceListFields,
    variables: { filters: { id }, skip: 0, take: 1 },
  })

  res.status(200).json({ price_list: priceList })
}
