import {
  deletePriceListsWorkflow,
  updatePriceListsWorkflow,
} from "@medusajs/core-flows"
import { MedusaError } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { listPriceLists } from "../queries"
import {
  adminPriceListRemoteQueryFields,
  defaultAdminPriceListFields,
} from "../query-config"
import { AdminPostPriceListsPriceListReq } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id
  const [[priceList], count] = await listPriceLists({
    container: req.scope,
    remoteQueryFields: adminPriceListRemoteQueryFields,
    apiFields: req.retrieveConfig.select!,
    variables: {
      filters: { id },
      skip: 0,
      take: 1,
    },
  })

  if (count === 0) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Price list with id: ${id} was not found`
    )
  }

  res.status(200).json({ price_list: priceList })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostPriceListsPriceListReq>,
  res: MedusaResponse
) => {
  const id = req.params.id
  const workflow = updatePriceListsWorkflow(req.scope)

  const [_, count] = await listPriceLists({
    container: req.scope,
    remoteQueryFields: adminPriceListRemoteQueryFields,
    apiFields: ["id"],
    variables: { filters: { id }, skip: 0, take: 1 },
  })

  if (count === 0) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Price list with id: ${id} was not found`
    )
  }

  const { errors } = await workflow.run({
    input: { priceListsData: [{ id, ...req.validatedBody }] },
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

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id
  const workflow = deletePriceListsWorkflow(req.scope)

  const { errors } = await workflow.run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "price_list",
    deleted: true,
  })
}
