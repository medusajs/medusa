import { setTaxRateRulesWorkflow } from "@medusajs/core-flows"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"
import { defaultAdminTaxRateFields } from "../../../../query-config"
import { AdminPostTaxRatesTaxRateRulesBatchSetReq } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostTaxRatesTaxRateRulesBatchSetReq>,
  res: MedusaResponse
) => {
  const rateRules = req.validatedBody.rules.map((r) => ({
    ...r,
    created_by: req.auth.actor_id,
  }))

  const { errors } = await setTaxRateRulesWorkflow(req.scope).run({
    input: { tax_rate_id: req.params.id, rules: rateRules },
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
