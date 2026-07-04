import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { getInitializedVariableName } from "../../util/ast"
import { getFilenameStem } from "../../util/filename"
import { KEBAB_CASE_RE, toKebab } from "../../util/strings"
import {
  createWorkflowSdkBindings,
  trackWorkflowSdkImports,
} from "../../util/workflow-scope"

type MessageIds = "notKebabCase" | "idMismatch"

/**
 * Strips a trailing `step` segment from a kebab string. `fetch-customers-step`
 * → `fetch-customers`. A bare `step` (no preceding segment) is left untouched —
 * stripping would yield an empty id.
 */
function stripStepSuffix(kebab: string): string {
  const stripped = kebab.replace(/-step$/, "")
  return stripped.length > 0 ? stripped : kebab
}

export const rule = createRule<[], MessageIds>({
  name: "step-id-kebab-case",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Step id (first argument of `createStep`) must be a kebab-case string literal and should match the enclosing variable name or filename (trailing `Step` segment stripped).",
    },
    fixable: "code",
    messages: {
      notKebabCase:
        "Step id `{{id}}` must be kebab-case (lowercase letters, digits, and hyphens; starting with a letter).",
      idMismatch:
        "Step id `{{id}}` should match the enclosing variable name or filename (expected `{{expected}}`).",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const bindings = createWorkflowSdkBindings()

    return {
      ImportDeclaration(node) {
        trackWorkflowSdkImports(node, bindings)
      },

      CallExpression(node) {
        if (bindings.createStep.size === 0) {
          return
        }
        if (node.callee.type !== AST_NODE_TYPES.Identifier) {
          return
        }
        if (!bindings.createStep.has(node.callee.name)) {
          return
        }

        const idArg = node.arguments[0]
        if (!idArg) {
          return
        }
        if (idArg.type !== AST_NODE_TYPES.Literal) {
          return
        }
        if (typeof idArg.value !== "string") {
          return
        }

        const id = idArg.value
        const quote = context.sourceCode.getText(idArg).charAt(0)
        const isKebab = KEBAB_CASE_RE.test(id)

        const varName = getInitializedVariableName(node)
        const fileStem = getFilenameStem(context.filename)

        const expected =
          (varName ? stripStepSuffix(toKebab(varName)) : null) ??
          (fileStem ? stripStepSuffix(toKebab(fileStem)) : null)

        if (!isKebab) {
          context.report({
            node: idArg,
            messageId: "notKebabCase",
            data: { id },
            fix(fixer) {
              const replacement = expected ?? stripStepSuffix(toKebab(id))
              if (!KEBAB_CASE_RE.test(replacement)) {
                return null
              }
              return fixer.replaceText(idArg, `${quote}${replacement}${quote}`)
            },
          })
          return
        }

        if (expected && expected !== id && KEBAB_CASE_RE.test(expected)) {
          context.report({
            node: idArg,
            messageId: "idMismatch",
            data: { id, expected },
            fix(fixer) {
              return fixer.replaceText(idArg, `${quote}${expected}${quote}`)
            },
          })
        }
      },
    }
  },
})

export default rule
