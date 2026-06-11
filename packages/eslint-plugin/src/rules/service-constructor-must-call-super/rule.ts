import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { findConstructor } from "../../util/ast"
import {
  createMedusaServiceBindings,
  isMedusaServiceSuper,
  trackMedusaServiceImports,
} from "../../util/service-scope"

type MessageIds = "missingSuperCall"

function bodyHasSuperCall(body: TSESTree.BlockStatement): boolean {
  for (const stmt of body.body) {
    if (stmt.type !== AST_NODE_TYPES.ExpressionStatement) continue
    const expr = stmt.expression
    if (expr.type !== AST_NODE_TYPES.CallExpression) continue
    if (expr.callee.type === AST_NODE_TYPES.Super) return true
  }
  return false
}

export const rule = createRule<[], MessageIds>({
  name: "service-constructor-must-call-super",
  meta: {
    type: "problem",
    docs: {
      description:
        "A service that extends `MedusaService(...)` and defines a constructor must call `super(...arguments)`.",
    },
    fixable: "code",
    messages: {
      missingSuperCall:
        "A constructor on a class extending `MedusaService(...)` must call `super(...arguments)`.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const bindings = createMedusaServiceBindings()

    function checkClass(
      node: TSESTree.ClassDeclaration | TSESTree.ClassExpression
    ) {
      if (!isMedusaServiceSuper(node.superClass, bindings)) return

      const ctor = findConstructor(node)
      if (!ctor) return

      const value = ctor.value
      if (value.type !== AST_NODE_TYPES.FunctionExpression) return

      const body = value.body
      if (bodyHasSuperCall(body)) return

      context.report({
        node: ctor.key,
        messageId: "missingSuperCall",
        fix(fixer) {
          const openBrace = context.sourceCode.getFirstToken(body)
          const closeBrace = context.sourceCode.getLastToken(body)
          if (!openBrace || !closeBrace) return null
          if (body.body.length === 0) {
            if (openBrace.loc.end.line === closeBrace.loc.start.line) {
              return fixer.insertTextAfter(openBrace, " super(...arguments) ")
            }
            const indent = " ".repeat(ctor.loc.start.column + 2)
            return fixer.replaceTextRange(
              [openBrace.range[1], closeBrace.range[0]],
              `\n${indent}super(...arguments)\n${" ".repeat(ctor.loc.start.column)}`
            )
          }
          const firstStmt = body.body[0]
          const indent = " ".repeat(firstStmt.loc.start.column)
          return fixer.insertTextBefore(firstStmt, `super(...arguments)\n${indent}`)
        },
      })
    }

    return {
      ImportDeclaration(node) {
        trackMedusaServiceImports(node, bindings)
      },

      ClassDeclaration: checkClass,
      ClassExpression: checkClass,
    }
  },
})

export default rule
