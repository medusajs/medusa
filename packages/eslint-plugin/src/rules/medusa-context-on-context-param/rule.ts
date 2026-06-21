import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import {
  createMedusaServiceBindings,
  getParamDecorators,
  getParamIdentifier,
  hasDecoratorWithLocalName,
  isContextTypedIdentifier,
  isMedusaServiceSuper,
  trackFrameworkUtilsImports,
  trackMedusaServiceImports,
} from "../../util/service-scope"

type MessageIds = "missingMedusaContext"

const MEDUSA_CONTEXT = "MedusaContext"

export const rule = createRule<[], MessageIds>({
  name: "medusa-context-on-context-param",
  meta: {
    type: "problem",
    docs: {
      description:
        "Service method parameters typed `Context` must be decorated with `@MedusaContext()`.",
    },
    fixable: "code",
    messages: {
      missingMedusaContext:
        "Service method parameters typed `Context` must be decorated with `@MedusaContext()`.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const serviceBindings = createMedusaServiceBindings()
    const medusaContextBinding = new Set<string>()

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
        if (member.computed) {
          continue
        }
        const value = member.value
        // Skip TypeScript overload signatures (bodyless declarations): the
        // `@MedusaContext()` decorator can only live on the implementation,
        // which is the method that carries a function body and is checked on
        // its own.
        if (value.type !== AST_NODE_TYPES.FunctionExpression) {
          continue
        }

        for (const param of value.params) {
          const id = getParamIdentifier(param)
          if (!id) {
            continue
          }
          if (!isContextTypedIdentifier(id)) {
            continue
          }

          if (
            hasDecoratorWithLocalName(
              getParamDecorators(param),
              medusaContextBinding
            )
          ) {
            continue
          }

          const localName =
            medusaContextBinding.values().next().value ?? MEDUSA_CONTEXT
          const canAutofix = medusaContextBinding.size > 0

          context.report({
            node: param,
            messageId: "missingMedusaContext",
            fix: canAutofix
              ? (fixer) => fixer.insertTextBefore(param, `@${localName}() `)
              : undefined,
          })
        }
      }
    }

    return {
      ImportDeclaration(node) {
        trackMedusaServiceImports(node, serviceBindings)
        trackFrameworkUtilsImports(node, {
          [MEDUSA_CONTEXT]: medusaContextBinding,
        })
      },

      ClassDeclaration: checkClass,
      ClassExpression: checkClass,
    }
  },
})

export default rule
