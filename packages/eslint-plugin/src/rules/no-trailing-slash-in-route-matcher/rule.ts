import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"

type MessageIds = "trailingSlash"

const DEFINE_MIDDLEWARES = "defineMiddlewares"

function collectMatcherLiterals(
  objectArg: TSESTree.Node,
  out: TSESTree.Literal[]
): void {
  const stack: TSESTree.Node[] = [objectArg]
  while (stack.length) {
    const node = stack.pop()!
    if (node.type === AST_NODE_TYPES.Property) {
      const key = node.key
      const isMatcherKey =
        (key.type === AST_NODE_TYPES.Identifier && key.name === "matcher") ||
        (key.type === AST_NODE_TYPES.Literal && key.value === "matcher")
      if (
        isMatcherKey &&
        node.value.type === AST_NODE_TYPES.Literal &&
        typeof node.value.value === "string"
      ) {
        out.push(node.value)
        continue
      }
    }
    for (const key of Object.keys(node) as Array<keyof typeof node>) {
      if (key === "parent") continue
      const value = (node as unknown as Record<string, unknown>)[key as string]
      if (!value) continue
      if (Array.isArray(value)) {
        for (const child of value) {
          if (child && typeof child === "object" && "type" in child) {
            stack.push(child as TSESTree.Node)
          }
        }
      } else if (typeof value === "object" && "type" in (value as object)) {
        stack.push(value as TSESTree.Node)
      }
    }
  }
}

export const rule = createRule<[], MessageIds>({
  name: "no-trailing-slash-in-route-matcher",
  meta: {
    type: "problem",
    docs: {
      description:
        "Route matchers passed to `defineMiddlewares(...)` should not end with a trailing slash; matchers without trailing slashes won't match URLs with trailing slashes.",
    },
    messages: {
      trailingSlash:
        "Route matcher should not end with a trailing slash. Remove the trailing `/`.",
    },
    fixable: "code",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type !== AST_NODE_TYPES.Identifier ||
          node.callee.name !== DEFINE_MIDDLEWARES
        ) {
          return
        }
        const arg = node.arguments[0]
        if (!arg || arg.type !== AST_NODE_TYPES.ObjectExpression) return

        const matchers: TSESTree.Literal[] = []
        collectMatcherLiterals(arg, matchers)

        for (const lit of matchers) {
          const value = lit.value as string
          if (value.length <= 1 || !value.endsWith("/")) continue
          context.report({
            node: lit,
            messageId: "trailingSlash",
            fix(fixer) {
              const raw = lit.raw
              const quote = raw[0]
              const inner = raw.slice(1, -1).replace(/\/+$/, "")
              return fixer.replaceText(lit, `${quote}${inner}${quote}`)
            },
          })
        }
      },
    }
  },
})

export default rule
