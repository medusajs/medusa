import {
  deletePriceListsWorkflow,
  updatePriceListsWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { getPriceList } from "../queries"
import {
  adminPriceListRemoteQueryFields,
  defaultAdminPriceListFields,
} from "../query-config"
import { AdminUpdatePriceListPriceType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id
  const priceList = await getPriceList({
    id,
    container: req.scope,
    remoteQueryFields: adminPriceListRemoteQueryFields,
    apiFields: req.retrieveConfig.select!,
  })

  res.status(200).json({ price_list: priceList })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdatePriceListPriceType>,
  res: MedusaResponse
) => {
  const id = req.params.id
  const workflow = updatePriceListsWorkflow(req.scope)

  const { errors } = await workflow.run({
    input: { price_lists_data: [{ ...req.validatedBody, id }] },
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
