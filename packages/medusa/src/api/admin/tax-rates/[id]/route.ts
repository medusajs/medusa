import {
  deleteTaxRatesWorkflow,
  updateTaxRatesWorkflow,
} from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { refetchTaxRate } from "../helpers"
import {
  AdminGetTaxRateParamsType,
  AdminUpdateTaxRateType,
} from "../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateTaxRateType>,
  res: MedusaResponse
) => {
  const { errors } = await updateTaxRatesWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: { ...req.validatedBody, updated_by: req.auth_context.actor_id },
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const taxRate = await refetchTaxRate(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ tax_rate: taxRate })
}

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetTaxRateParamsType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "tax_rate",
    variables,
    fields: req.remoteQueryConfig.fields,
  })

  const [taxRate] = await remoteQuery(queryObject)
  res.status(200).json({ tax_rate: taxRate })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id
  const { errors } = await deleteTaxRatesWorkflow(req.scope).run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "tax_rate",
    deleted: true,
  })
}
