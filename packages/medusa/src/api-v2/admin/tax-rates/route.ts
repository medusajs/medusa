import { createTaxRatesWorkflow } from "@medusajs/core-flows"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { defaultAdminTaxRateFields } from "./query-config"
import { AdminPostTaxRatesReq } from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostTaxRatesReq>,
  res: MedusaResponse
) => {
  const { result, errors } = await createTaxRatesWorkflow(req.scope).run({
    input: [
      {
        ...req.validatedBody,
        created_by: req.auth.actor_id,
      },
    ],
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve("remoteQuery")

  const query = remoteQueryObjectFromString({
    entryPoint: "tax_rate",
    variables: { id: result[0].id },
    fields: defaultAdminTaxRateFields,
  })

  const [taxRate] = await remoteQuery(query)

  res.status(200).json({ tax_rate: taxRate })
}

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "tax_rates",
    variables,
    fields: defaultAdminTaxRateFields,
  })

  const rates = await remoteQuery(queryObject)

  res.status(200).json({ tax_rates: rates })
}
