import {
  deletePriceListsWorkflow,
  updatePriceListsWorkflow,
} from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { fetchPriceList } from "../helpers"
import { HttpTypes } from "@zjedene-medusa/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminPriceListParams>,
  res: MedusaResponse<HttpTypes.AdminPriceListResponse>
) => {
  const price_list = await fetchPriceList(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ price_list })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminUpdatePriceList,
    HttpTypes.AdminPriceListParams
  >,
  res: MedusaResponse<HttpTypes.AdminPriceListResponse>
) => {
  const id = req.params.id
  const workflow = updatePriceListsWorkflow(req.scope)

  await workflow.run({
    input: { price_lists_data: [{ ...req.validatedBody, id }] },
  })

  const price_list = await fetchPriceList(id, req.scope, req.queryConfig.fields)

  res.status(200).json({ price_list })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminPriceListDeleteResponse>
) => {
  const id = req.params.id
  const workflow = deletePriceListsWorkflow(req.scope)

  await workflow.run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "price_list",
    deleted: true,
  })
}
