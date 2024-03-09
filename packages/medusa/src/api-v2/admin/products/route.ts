import { createProductsWorkflow } from "@medusajs/core-flows"
import { CreateProductDTO } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  isString,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { listPriceLists } from "../price-lists/queries"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const filterableFields = { ...req.filterableFields }
  const filterByPriceListIds =
    (filterableFields.price_list_id as string[]) || []
  const priceListVariantIds: string[] = []

  // When filtering by price_list_id, we need use the remote query to get
  // the variant IDs through the price list price sets.
  if (filterByPriceListIds.length) {
    const [priceLists] = await listPriceLists({
      container: req.scope,
      fields: ["prices.variant_id"],
      variables: { filters: { id: filterByPriceListIds }, skip: 0, take: null },
    })

    priceListVariantIds.push(
      ...(priceLists
        .map((priceList) => priceList.prices?.map((price) => price.variant_id))
        .flat(2)
        .filter(isString) || [])
    )

    delete filterableFields.price_list_id
  }

  if (priceListVariantIds.length) {
    const existingVariantFilters = filterableFields.variants || {}

    filterableFields.variants = {
      ...existingVariantFilters,
      id: priceListVariantIds,
    }
  }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product",
    variables: {
      filters: filterableFields,
      order: req.listConfig.order,
      skip: req.listConfig.skip,
      take: req.listConfig.take,
    },
    fields: req.listConfig.select as string[],
  })

  const { rows: products, metadata } = await remoteQuery(queryObject)

  res.json({
    products,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateProductDTO>,
  res: MedusaResponse
) => {
  const input = [
    {
      ...req.validatedBody,
    },
  ]

  const { result, errors } = await createProductsWorkflow(req.scope).run({
    input: { products: input },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ product: result[0] })
}
