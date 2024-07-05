import { createPriceListsWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { fetchPriceList, transformPriceList } from "./helpers"
import { AdminCreatePriceListType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "price_list",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: priceLists, metadata } = await remoteQuery(queryObject)

  res.json({
    price_lists: priceLists.map((priceList) => transformPriceList(priceList)),
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreatePriceListType>,
  res: MedusaResponse
) => {
  const workflow = createPriceListsWorkflow(req.scope)
  const { result, errors } = await workflow.run({
    input: { price_lists_data: [req.validatedBody] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const price_list = await fetchPriceList(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ price_list })
}
