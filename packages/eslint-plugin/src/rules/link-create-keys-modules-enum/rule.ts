import type { TSESTree, TSESLint } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { FRAMEWORK_UTILS_SOURCE } from "../../constants"

type MessageIds = "preferEnumKey"

const LINK_METHODS = new Set(["create", "dismiss", "delete", "restore"])

const REMOTE_LINK_STEPS = new Set([
  "createRemoteLinkStep",
  "dismissRemoteLinkStep",
  "removeRemoteLinkStep",
  "updateRemoteLinksStep",
])

/**
 * Map of known `Modules.*` string values → enum member name.
 * Sourced from `packages/core/utils/src/modules-sdk/definition.ts`.
 */
const MODULES_BY_VALUE: Record<string, string> = {
  analytics: "ANALYTICS",
  auth: "AUTH",
  cache: "CACHE",
  cart: "CART",
  customer: "CUSTOMER",
  event_bus: "EVENT_BUS",
  inventory: "INVENTORY",
  link_modules: "LINK",
  payment: "PAYMENT",
  pricing: "PRICING",
  product: "PRODUCT",
  promotion: "PROMOTION",
  sales_channel: "SALES_CHANNEL",
  tax: "TAX",
  fulfillment: "FULFILLMENT",
  stock_location: "STOCK_LOCATION",
  user: "USER",
  workflows: "WORKFLOW_ENGINE",
  region: "REGION",
  order: "ORDER",
  api_key: "API_KEY",
  store: "STORE",
  currency: "CURRENCY",
  file: "FILE",
  notification: "NOTIFICATION",
  index: "INDEX",
  locking: "LOCKING",
  settings: "SETTINGS",
  caching: "CACHING",
  translation: "TRANSLATION",
  rbac: "RBAC",
}

const MODULES = "Modules"

function getStaticKey(
  prop: TSESTree.Property
): { value: string; node: TSESTree.Node; isLiteral: boolean } | null {
  if (prop.computed) return null
  if (prop.key.type === AST_NODE_TYPES.Identifier) {
    return { value: prop.key.name, node: prop.key, isLiteral: false }
  }
  if (
    prop.key.type === AST_NODE_TYPES.Literal &&
    typeof prop.key.value === "string"
  ) {
    return { value: prop.key.value, node: prop.key, isLiteral: true }
  }
  return null
}

export const rule = createRule<[], MessageIds>({
  name: "link-create-keys-modules-enum",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prefer `Modules.*` enum members over bare string keys in link calls and remote-link workflow steps.",
    },
    fixable: "code",
    messages: {
      preferEnumKey:
        "Use `Modules.{{enumMember}}` instead of the bare key `{{key}}`.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const modulesLocalNames = new Set<string>()
    const stepLocalNames = new Set<string>()
    let frameworkUtilsImportNode: TSESTree.ImportDeclaration | null = null

    function isLinkMethodCall(callee: TSESTree.Expression): boolean {
      return (
        callee.type === AST_NODE_TYPES.MemberExpression &&
        !callee.computed &&
        callee.property.type === AST_NODE_TYPES.Identifier &&
        LINK_METHODS.has(callee.property.name)
      )
    }

    function isStepCall(callee: TSESTree.Expression): boolean {
      return (
        callee.type === AST_NODE_TYPES.Identifier &&
        stepLocalNames.has(callee.name)
      )
    }

    function checkObject(obj: TSESTree.ObjectExpression) {
      for (const prop of obj.properties) {
        if (prop.type !== AST_NODE_TYPES.Property) continue
        const key = getStaticKey(prop)
        if (!key) continue
        const enumMember = MODULES_BY_VALUE[key.value]
        if (!enumMember) continue

        context.report({
          node: key.node,
          messageId: "preferEnumKey",
          data: { key: key.value, enumMember },
          fix(fixer: TSESLint.RuleFixer) {
            const fixes: TSESLint.RuleFix[] = []
            const modulesName =
              modulesLocalNames.size > 0
                ? (modulesLocalNames.values().next().value as string)
                : MODULES
            const replacement = `[${modulesName}.${enumMember}]`

            if (prop.shorthand) {
              // `{ product }` → `{ [Modules.PRODUCT]: product }`
              const valueText = context.sourceCode.getText(prop.value)
              fixes.push(
                fixer.replaceText(prop, `${replacement}: ${valueText}`)
              )
            } else {
              fixes.push(fixer.replaceText(key.node, replacement))
            }

            if (modulesLocalNames.size === 0) {
              const importFix = addModulesImport(fixer)
              if (!importFix) return null
              fixes.push(importFix)
              modulesLocalNames.add(MODULES)
            }

            return fixes
          },
        })
      }
    }

    function addModulesImport(
      fixer: TSESLint.RuleFixer
    ): TSESLint.RuleFix | null {
      if (frameworkUtilsImportNode) {
        const specifiers = frameworkUtilsImportNode.specifiers.filter(
          (s): s is TSESTree.ImportSpecifier =>
            s.type === AST_NODE_TYPES.ImportSpecifier
        )
        if (specifiers.length === 0) return null
        const last = specifiers[specifiers.length - 1]
        return fixer.insertTextAfter(last, `, ${MODULES}`)
      }
      const program = context.sourceCode.ast
      const first = program.body[0]
      const importLine = `import { ${MODULES} } from "${FRAMEWORK_UTILS_SOURCE}"\n`
      if (!first) {
        return fixer.insertTextAfterRange([0, 0], importLine)
      }
      return fixer.insertTextBefore(first, importLine)
    }

    function checkFirstArg(arg: TSESTree.CallExpressionArgument) {
      if (arg.type === AST_NODE_TYPES.ObjectExpression) {
        checkObject(arg)
        return
      }
      if (arg.type === AST_NODE_TYPES.ArrayExpression) {
        for (const el of arg.elements) {
          if (el && el.type === AST_NODE_TYPES.ObjectExpression) {
            checkObject(el)
          }
        }
      }
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value === FRAMEWORK_UTILS_SOURCE) {
          frameworkUtilsImportNode = node
          for (const specifier of node.specifiers) {
            if (
              specifier.type === AST_NODE_TYPES.ImportSpecifier &&
              specifier.imported.type === AST_NODE_TYPES.Identifier &&
              specifier.imported.name === MODULES
            ) {
              modulesLocalNames.add(specifier.local.name)
            }
          }
        }
        if (node.source.value === "@medusajs/medusa/core-flows") {
          for (const specifier of node.specifiers) {
            if (
              specifier.type === AST_NODE_TYPES.ImportSpecifier &&
              specifier.imported.type === AST_NODE_TYPES.Identifier &&
              REMOTE_LINK_STEPS.has(specifier.imported.name)
            ) {
              stepLocalNames.add(specifier.local.name)
            }
          }
        }
      },

      CallExpression(node) {
        if (isLinkMethodCall(node.callee) || isStepCall(node.callee)) {
          const arg = node.arguments[0]
          if (arg) checkFirstArg(arg)
        }
      },
    }
  },
})

export default rule
