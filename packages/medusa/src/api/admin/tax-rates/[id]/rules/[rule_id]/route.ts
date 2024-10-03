import { deleteTaxRateRulesWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { refetchTaxRate } from "../../../helpers"
import { HttpTypes } from "@medusajs/framework/types"

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminTaxRateRuleDeleteResponse>
) => {
  await deleteTaxRateRulesWorkflow(req.scope).run({
    input: { ids: [req.params.rule_id] },
  })

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
