import { MedusaError } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { batchPriceListPricesWorkflow } from "@medusajs/core-flows"
import { LinkMethodRequest } from "@medusajs/types/src"
import { fetchPriceList, fetchPriceListPriceIdsForProduct } from "../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<LinkMethodRequest>,
  res: MedusaResponse
) => {
  const id = req.params.id
  const { add, remove = [] } = req.validatedBody
  if (add?.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Adding products directly to a price list is not supported, please use the /admin/price-lists/:id/prices/batch endpoint instead"
    )
  }

  if (!remove.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "No product ids passed to remove from price list"
    )
  }

  const productPriceIds = await fetchPriceListPriceIdsForProduct(
    id,
    remove,
    req.scope
  )

  const workflow = batchPriceListPricesWorkflow(req.scope)
  const { result, errors } = await workflow.run({
    input: {
      data: {
        id,
        create: [],
        update: [],
        delete: productPriceIds,
      },
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const priceList = await fetchPriceList(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ price_list: priceList })
}
