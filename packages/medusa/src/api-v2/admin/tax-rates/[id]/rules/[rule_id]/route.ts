import { deleteTaxRateRulesWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { refetchTaxRate } from "../../../helpers"

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

  const taxRate = await refetchTaxRate(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({
    id: req.params.rule_id,
    object: "tax_rate_rule",
    deleted: true,
    parent: taxRate,
  })
}
