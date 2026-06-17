import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import {
  createMedusaServiceBindings,
  hasContextParam,
  hasDecoratorWithLocalName,
  isMedusaServiceSuper,
  trackFrameworkUtilsImports,
  trackMedusaServiceImports,
} from "../../util/service-scope"

type MessageIds = "missingInjectManager" | "missingInjectTransactionManager"

const INJECT_MANAGER = "InjectManager"
const INJECT_TRANSACTION_MANAGER = "InjectTransactionManager"

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
    const injectManagerBinding = new Set<string>()
    const injectTransactionManagerBinding = new Set<string>()

    function checkClass(
      node: TSESTree.ClassDeclaration | TSESTree.ClassExpression
    ) {
      if (!isMedusaServiceSuper(node.superClass, serviceBindings)) {
        return
      }

      for (const member of node.body.body) {
        if (member.type !== AST_NODE_TYPES.MethodDefinition) {
          continue
        }
        if (member.kind === "constructor") {
          continue
        }
        if (member.kind !== "method") {
          continue
        }
        if (member.computed) {
          continue
        }
        const value = member.value
        // Skip TypeScript overload signatures (bodyless declarations): the
        // decorator can only live on the implementation, which is the method
        // that carries a function body and is checked on its own.
        if (value.type !== AST_NODE_TYPES.FunctionExpression) {
          continue
        }

        if (!hasContextParam(value)) {
          continue
        }

        const isInternal =
          member.accessibility === "protected" ||
          member.accessibility === "private"
        const requiredLocalNames = isInternal
          ? injectTransactionManagerBinding
          : injectManagerBinding
        const canonicalName = isInternal
          ? INJECT_TRANSACTION_MANAGER
          : INJECT_MANAGER
        const messageId: MessageIds = isInternal
          ? "missingInjectTransactionManager"
          : "missingInjectManager"

        if (hasDecoratorWithLocalName(member.decorators, requiredLocalNames)) {
          continue
        }

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
        trackFrameworkUtilsImports(node, {
          [INJECT_MANAGER]: injectManagerBinding,
          [INJECT_TRANSACTION_MANAGER]: injectTransactionManagerBinding,
        })
      },

      ClassDeclaration: checkClass,
      ClassExpression: checkClass,
    }
  },
})

export default rule
