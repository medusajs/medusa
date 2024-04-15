import { batchPriceListPricesWorkflow } from "@medusajs/core-flows"
import { z } from "zod"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { getPriceList } from "../../../queries"
import {
  adminPriceListRemoteQueryFields,
  defaultAdminPriceListFields,
} from "../../../query-config"
import { AdminBatchPriceListPrices } from "../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<z.infer<typeof AdminBatchPriceListPrices>>,
  res: MedusaResponse
) => {
  const {
    create = [],
    update = [],
    delete: deletePriceIds = [],
  } = req.validatedBody

  const id = req.params.id
  const workflow = batchPriceListPricesWorkflow(req.scope)
  const { result, errors } = await workflow.run({
    input: {
      data: {
        id,
        create,
        update,
        delete: deletePriceIds,
      },
    },
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

  res.status(200).json(result)
}
