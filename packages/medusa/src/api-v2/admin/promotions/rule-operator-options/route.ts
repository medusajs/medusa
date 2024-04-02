import { PromotionRuleOperator } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const operators = [
    {
      id: "in",
      value: PromotionRuleOperator.IN,
      label: "In",
    },
    {
      id: "eq",
      value: PromotionRuleOperator.EQ,
      label: "Equals",
    },
    {
      id: "ne",
      value: PromotionRuleOperator.NE,
      label: "Not In",
    },
  ]

  res.json({
    operators,
  })
}
