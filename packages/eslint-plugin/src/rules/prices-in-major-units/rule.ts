import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { findProperty, getPropertyKeyName } from "../../util/ast"

type MessageIds =
  | "multipliedByHundred"
  | "centsIdentifier"
  | "largeIntegerLikelyCents"

const PRICE_KEY_REGEX =
  /^(amount|unit_price|raw_amount|price|original_total|subtotal|total|tax_total|shipping_total|discount_total)$/

const CENTS_NAME_REGEX = /(^cents$|_cents$|InCents$)/

// ISO 4217 currencies with zero minor units (no decimals). For these, an
// integer value isn't a strong signal that the amount is "in cents."
const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif",
  "clp",
  "djf",
  "gnf",
  "isk",
  "jpy",
  "kmf",
  "krw",
  "mga",
  "pyg",
  "rwf",
  "ugx",
  "vnd",
  "vuv",
  "xaf",
  "xof",
  "xpf",
])

const LARGE_INT_THRESHOLD = 1000

function isMultiplyByCentsFactor(node: TSESTree.Node): boolean {
  if (node.type !== AST_NODE_TYPES.BinaryExpression) return false
  if (node.operator !== "*") return false
  const isFactor = (n: TSESTree.Node): boolean =>
    n.type === AST_NODE_TYPES.Literal &&
    (n.value === 100 || n.value === 1000)
  return isFactor(node.right) || isFactor(node.left)
}

function getReferenceName(node: TSESTree.Node): string | null {
  if (node.type === AST_NODE_TYPES.Identifier) return node.name
  if (
    node.type === AST_NODE_TYPES.MemberExpression &&
    !node.computed &&
    node.property.type === AST_NODE_TYPES.Identifier
  ) {
    return node.property.name
  }
  return null
}

function isCentsReference(node: TSESTree.Node): boolean {
  const name = getReferenceName(node)
  if (!name) return false
  return CENTS_NAME_REGEX.test(name)
}

function isLargeIntegerLiteral(node: TSESTree.Node): boolean {
  if (node.type !== AST_NODE_TYPES.Literal) return false
  if (typeof node.value !== "number") return false
  if (!Number.isInteger(node.value)) return false
  if (node.value < LARGE_INT_THRESHOLD) return false
  // The raw source must have no decimal point — `1000.0` should not trigger.
  if (typeof node.raw === "string" && node.raw.includes(".")) return false
  return true
}

function getSiblingCurrencyCode(
  obj: TSESTree.ObjectExpression
): string | null {
  const prop = findProperty(obj, "currency_code")
  if (!prop) return null
  const value = prop.value
  if (
    value.type === AST_NODE_TYPES.Literal &&
    typeof value.value === "string"
  ) {
    return value.value.toLowerCase()
  }
  return null
}

export const rule = createRule<[], MessageIds>({
  name: "prices-in-major-units",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prices in Medusa are stored in major units (decimals). Flag values that look like they're in the smallest currency unit (cents).",
    },
    messages: {
      multipliedByHundred:
        "`{{key}}` looks like it's multiplied to cents. Medusa expects prices in major units (decimals).",
      centsIdentifier:
        "`{{key}}` is set from a `{{name}}` value that looks like it's in the smallest currency unit. Medusa expects prices in major units (decimals).",
      largeIntegerLikelyCents:
        "`{{key}}: {{value}}` looks like it's in the smallest currency unit. Medusa expects prices in major units (decimals).",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    function checkAssignment(
      key: string,
      expr: TSESTree.Node,
      reportNode: TSESTree.Node,
      isZeroDecimal: boolean
    ): void {
      if (isMultiplyByCentsFactor(expr)) {
        context.report({
          node: reportNode,
          messageId: "multipliedByHundred",
          data: { key },
        })
        return
      }

      if (isCentsReference(expr)) {
        context.report({
          node: reportNode,
          messageId: "centsIdentifier",
          data: { key, name: getReferenceName(expr) ?? "" },
        })
        return
      }

      if (isLargeIntegerLiteral(expr) && !isZeroDecimal) {
        context.report({
          node: reportNode,
          messageId: "largeIntegerLikelyCents",
          data: {
            key,
            value: String((expr as TSESTree.Literal).value),
          },
        })
        return
      }
    }

    return {
      ObjectExpression(node) {
        const currency = getSiblingCurrencyCode(node)
        const isZeroDecimal =
          currency !== null && ZERO_DECIMAL_CURRENCIES.has(currency)

        for (const prop of node.properties) {
          if (prop.type !== AST_NODE_TYPES.Property) continue
          const key = getPropertyKeyName(prop)
          if (!key || !PRICE_KEY_REGEX.test(key)) continue
          const value = prop.value
          if (
            value.type === AST_NODE_TYPES.AssignmentPattern ||
            value.type === AST_NODE_TYPES.TSEmptyBodyFunctionExpression
          ) {
            continue
          }
          checkAssignment(key, value, value, isZeroDecimal)
        }
      },
      VariableDeclarator(node) {
        if (node.id.type !== AST_NODE_TYPES.Identifier) return
        if (!PRICE_KEY_REGEX.test(node.id.name)) return
        if (!node.init) return
        checkAssignment(node.id.name, node.init, node.init, false)
      },
      AssignmentExpression(node) {
        if (node.operator !== "=") return
        const name = getReferenceName(node.left)
        if (!name || !PRICE_KEY_REGEX.test(name)) return
        checkAssignment(name, node.right, node.right, false)
      },
    }
  },
})

export default rule
