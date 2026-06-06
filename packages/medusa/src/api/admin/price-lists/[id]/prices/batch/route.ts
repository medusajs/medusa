import { promiseAll } from "@zjedene-medusa/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { listPrices } from "../../../queries"
import { adminPriceListPriceQueryFields } from "../../../query-config"
import { BatchMethodRequest, HttpTypes } from "@zjedene-medusa/framework/types"
import {
  AdminCreatePriceListPriceType,
  AdminUpdatePriceListPriceType,
} from "../../../validators"
import { batchPriceListPricesWorkflow } from "@zjedene-medusa/core-flows"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    BatchMethodRequest<
      AdminCreatePriceListPriceType,
      AdminUpdatePriceListPriceType
    >,
    HttpTypes.AdminGetPriceListPriceParams
  >,
  res: MedusaResponse<HttpTypes.AdminPriceListBatchResponse>
) => {
  const id = req.params.id
  const {
    create = [],
    update = [],
    delete: deletePriceIds = [],
  } = req.validatedBody

  const workflow = batchPriceListPricesWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      data: {
        id,
        create,
        update,
        delete: deletePriceIds,
      },
    },
  })

  const [created, updated] = await promiseAll([
    listPrices(
      result.created.map((c) => c.id),
      req.scope,
      adminPriceListPriceQueryFields
    ),
    listPrices(
      result.updated.map((c) => c.id),
      req.scope,
      adminPriceListPriceQueryFields
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
