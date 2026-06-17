import { ESLintUtils } from "@typescript-eslint/utils"

export interface MedusaRuleDocs {
  description: string
  recommended?: boolean
  strict?: boolean
  requiresTypeChecking?: boolean
}

export const createRule = ESLintUtils.RuleCreator<MedusaRuleDocs>(
  (name) => `https://docs.medusajs.com/resources/lint/rules/${name}`
)
