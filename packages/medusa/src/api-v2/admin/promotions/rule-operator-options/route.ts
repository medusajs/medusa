import { RuleOperator } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

const operators = [
  {
    id: RuleOperator.IN,
    value: RuleOperator.IN,
    label: "In",
  },
  {
    id: RuleOperator.EQ,
    value: RuleOperator.EQ,
    label: "Equals",
  },
  {
    id: RuleOperator.NE,
    value: RuleOperator.NE,
    label: "Not In",
  },
]

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  res.json({
    operators,
  })
}
