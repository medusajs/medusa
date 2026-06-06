import { deleteTaxRateRulesWorkflow } from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { refetchTaxRate } from "../../../helpers"
import { HttpTypes } from "@zjedene-medusa/framework/types"

export const DELETE = async (
  req: AuthenticatedMedusaRequest<{}, HttpTypes.SelectParams>,
  res: MedusaResponse<HttpTypes.AdminTaxRateRuleDeleteResponse>
) => {
  await deleteTaxRateRulesWorkflow(req.scope).run({
    input: { ids: [req.params.rule_id] },
  })

  const taxRate = await refetchTaxRate(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({
    id: req.params.rule_id,
    object: "tax_rate_rule",
    deleted: true,
    parent: taxRate,
  })
}
