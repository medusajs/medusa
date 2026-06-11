import { ESLintUtils } from "@typescript-eslint/utils"

export interface MedusaRuleDocs {
  description: string
  recommended?: boolean
  strict?: boolean
  requiresTypeChecking?: boolean
}

export const createRule = ESLintUtils.RuleCreator(
  // TODO: Update this to point to the actual documentation for each rule once it's published
  (name) => `https://docs.medusajs.com/resources/lint/rules/${name}`
)
