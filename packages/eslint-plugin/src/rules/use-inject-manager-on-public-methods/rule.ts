import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { FRAMEWORK_UTILS_SOURCE } from "../../constants"
import { createRule } from "../../create-rule"
import {
  createMedusaServiceBindings,
  isServiceClass,
  trackMedusaServiceImports,
} from "../../util/service-scope"

type MessageIds = "missingInjectManager" | "missingInjectTransactionManager"

const INJECT_MANAGER = "InjectManager"
const INJECT_TRANSACTION_MANAGER = "InjectTransactionManager"
const CONTEXT_TYPE = "Context"

type DecoratorBindings = {
  injectManager: Set<string>
  injectTransactionManager: Set<string>
}

function trackDecoratorImports(
  node: TSESTree.ImportDeclaration,
  bindings: DecoratorBindings
): void {
  if (node.source.value !== FRAMEWORK_UTILS_SOURCE) return
  for (const specifier of node.specifiers) {
    if (specifier.type !== AST_NODE_TYPES.ImportSpecifier) continue
    if (specifier.imported.type !== AST_NODE_TYPES.Identifier) continue
    if (specifier.imported.name === INJECT_MANAGER) {
      bindings.injectManager.add(specifier.local.name)
    } else if (specifier.imported.name === INJECT_TRANSACTION_MANAGER) {
      bindings.injectTransactionManager.add(specifier.local.name)
    }
  }
}

function getParamIdentifier(
  param: TSESTree.Parameter
): TSESTree.Identifier | null {
  if (param.type === AST_NODE_TYPES.Identifier) return param
  if (
    param.type === AST_NODE_TYPES.AssignmentPattern &&
    param.left.type === AST_NODE_TYPES.Identifier
  ) {
    return param.left
  }
  return null
}

function hasContextParam(
  fn: TSESTree.FunctionExpression | TSESTree.TSEmptyBodyFunctionExpression
): boolean {
  for (const param of fn.params) {
    const id = getParamIdentifier(param)
    if (!id) continue
    const annotation = id.typeAnnotation?.typeAnnotation
    if (!annotation) continue
    if (annotation.type !== AST_NODE_TYPES.TSTypeReference) continue
    if (annotation.typeName.type !== AST_NODE_TYPES.Identifier) continue
    if (annotation.typeName.name === CONTEXT_TYPE) return true
  }
  return false
}

function hasDecoratorFrom(
  member: TSESTree.MethodDefinition,
  names: Set<string>
): boolean {
  const decorators = member.decorators
  if (!decorators?.length) return false
  for (const decorator of decorators) {
    const expr = decorator.expression
    let calleeName: string | null = null
    if (expr.type === AST_NODE_TYPES.CallExpression) {
      if (expr.callee.type === AST_NODE_TYPES.Identifier) {
        calleeName = expr.callee.name
      }
    } else if (expr.type === AST_NODE_TYPES.Identifier) {
      calleeName = expr.name
    }
    if (calleeName && names.has(calleeName)) return true
  }
  return false
}

export const rule = createRule<[], MessageIds>({
  name: "use-inject-manager-on-public-methods",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Service methods that accept a `Context` parameter should be decorated with `@InjectManager()` (public) or `@InjectTransactionManager()` (protected).",
    },
    fixable: "code",
    messages: {
      missingInjectManager:
        "Public service methods that accept a `Context` parameter must be decorated with `@InjectManager()`.",
      missingInjectTransactionManager:
        "Protected/private service methods that accept a `Context` parameter must be decorated with `@InjectTransactionManager()`.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const serviceBindings = createMedusaServiceBindings()
    const decoratorBindings: DecoratorBindings = {
      injectManager: new Set(),
      injectTransactionManager: new Set(),
    }

    function checkClass(
      node: TSESTree.ClassDeclaration | TSESTree.ClassExpression
    ) {
      if (!isServiceClass(node, serviceBindings)) return

      for (const member of node.body.body) {
        if (member.type !== AST_NODE_TYPES.MethodDefinition) continue
        if (member.kind === "constructor") continue
        if (member.kind !== "method") continue
        if (member.computed) continue
        const value = member.value
        if (
          value.type !== AST_NODE_TYPES.FunctionExpression &&
          value.type !== AST_NODE_TYPES.TSEmptyBodyFunctionExpression
        ) {
          continue
        }

        if (!hasContextParam(value)) continue

        const isInternal =
          member.accessibility === "protected" ||
          member.accessibility === "private"
        const requiredLocalNames = isInternal
          ? decoratorBindings.injectTransactionManager
          : decoratorBindings.injectManager
        const canonicalName = isInternal
          ? INJECT_TRANSACTION_MANAGER
          : INJECT_MANAGER
        const messageId: MessageIds = isInternal
          ? "missingInjectTransactionManager"
          : "missingInjectManager"

        if (hasDecoratorFrom(member, requiredLocalNames)) continue

        const localName =
          requiredLocalNames.values().next().value ?? canonicalName
        const canAutofix = requiredLocalNames.size > 0

        context.report({
          node: member.key,
          messageId,
          fix: canAutofix
            ? (fixer) => {
                const indent = " ".repeat(member.loc.start.column)
                return fixer.insertTextBefore(
                  member,
                  `@${localName}()\n${indent}`
                )
              }
            : undefined,
        })
      }
    }

    return {
      ImportDeclaration(node) {
        trackMedusaServiceImports(node, serviceBindings)
        trackDecoratorImports(node, decoratorBindings)
      },

      ClassDeclaration: checkClass,
      ClassExpression: checkClass,
    }
  },
})

export default rule
