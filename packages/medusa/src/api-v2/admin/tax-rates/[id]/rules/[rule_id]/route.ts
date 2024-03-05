import { deleteTaxRateRulesWorkflow } from "@medusajs/core-flows"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { defaultAdminTaxRatesFields } from "../../../../../../api/routes/admin/tax-rates"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { errors } = await deleteTaxRateRulesWorkflow(req.scope).run({
    input: { ids: [req.params.rule_id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve("remoteQuery")

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "tax_rate",
    variables: { id: req.params.id },
    fields: defaultAdminTaxRatesFields,
  })

  const [taxRate] = await remoteQuery(queryObject)

  res.status(200).json({ tax_rate: taxRate })
}
