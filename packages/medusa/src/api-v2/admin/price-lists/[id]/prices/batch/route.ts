import { batchPriceListPricesWorkflow } from "@medusajs/core-flows"
import { promiseAll } from "@medusajs/utils"
import { z } from "zod"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { listPrices } from "../../../queries"
import { adminPriceRemoteQueryFields } from "../../../query-config"
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

  const [created, updated] = await promiseAll([
    listPrices(
      result.created.map((c) => c.id),
      req.scope,
      adminPriceRemoteQueryFields
    ),
    listPrices(
      result.updated.map((c) => c.id),
      req.scope,
      adminPriceRemoteQueryFields
    ),
  ])

  res.status(200).json({
    created,
    updated,
    deleted: {
      ids: deletePriceIds,
      object: "price",
      deleted: true,
    },
  })
}
