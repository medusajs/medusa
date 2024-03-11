import { createPriceListsWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { listPriceLists } from "./queries"
import {
  adminPriceListRemoteQueryFields,
  defaultAdminPriceListFields,
} from "./query-config"
import { AdminPostPriceListsReq } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { limit, offset } = req.validatedQuery
  const [priceLists, count] = await listPriceLists({
    container: req.scope,
    apiFields: req.listConfig.select!,
    remoteQueryFields: adminPriceListRemoteQueryFields,
    variables: {
      filters: req.filterableFields,
      order: req.listConfig.order,
      skip: req.listConfig.skip,
      take: req.listConfig.take,
    },
  })

  res.json({
    count,
    price_lists: priceLists,
    offset,
    limit,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostPriceListsReq>,
  res: MedusaResponse
) => {
  const workflow = createPriceListsWorkflow(req.scope)
  const priceListsData = [req.validatedBody]

  const { result, errors } = await workflow.run({
    input: { priceListsData },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const [[priceList]] = await listPriceLists({
    container: req.scope,
    apiFields: defaultAdminPriceListFields,
    remoteQueryFields: adminPriceListRemoteQueryFields,
    variables: {
      filters: { id: result[0].id },
      skip: 0,
      take: 1,
    },
  })

  res.status(200).json({ price_list: priceList })
}
