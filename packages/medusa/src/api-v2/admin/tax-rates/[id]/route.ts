import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

import { defaultAdminTaxRateFields } from "../query-config"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { AdminPostTaxRatesTaxRateReq } from "../../../../api/routes/admin/tax-rates"
import {
  deleteTaxRatesWorkflow,
  updateTaxRatesWorkflow,
} from "@medusajs/core-flows"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostTaxRatesTaxRateReq>,
  res: MedusaResponse
) => {
  const { errors } = await updateTaxRatesWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve("remoteQuery")

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "tax_rate",
    variables: { id: req.params.id },
    fields: defaultAdminTaxRateFields,
  })

  const [taxRate] = await remoteQuery(queryObject)

  res.status(200).json({ tax_rate: taxRate })
}

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "tax_rate",
    variables,
    fields: defaultAdminTaxRateFields,
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
