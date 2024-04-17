import { batchPriceListPricesWorkflow } from "@medusajs/core-flows"
import { promiseAll } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { fetchPriceListPriceIdsForProduct } from "../../../helpers"
import { listPrices } from "../../../queries"
import { adminPriceListPriceRemoteQueryFields } from "../../../query-config"
import { AdminBatchPriceListPricesType } from "../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminBatchPriceListPricesType>,
  res: MedusaResponse
) => {
  const id = req.params.id
  const {
    create = [],
    update = [],
    delete: deletePriceIds = [],
    product_id: productIds = [],
  } = req.validatedBody

  const productPriceIds = await fetchPriceListPriceIdsForProduct(
    id,
    productIds,
    req.scope
  )

  const priceIdsToDelete = [...deletePriceIds, ...productPriceIds]
  const workflow = batchPriceListPricesWorkflow(req.scope)
  const { result, errors } = await workflow.run({
    input: {
      data: {
        id,
        create,
        update,
        delete: priceIdsToDelete,
      },
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const [created, updated] = await promiseAll([
    listPrices(
      result.created.map((c) => c.id),
      req.scope,
      adminPriceListPriceRemoteQueryFields
    ),
    listPrices(
      result.updated.map((c) => c.id),
      req.scope,
      adminPriceListPriceRemoteQueryFields
    ),
  ])

  res.status(200).json({
    created,
    updated,
    deleted: {
      ids: priceIdsToDelete,
      object: "price",
      deleted: true,
    },
  })
}
