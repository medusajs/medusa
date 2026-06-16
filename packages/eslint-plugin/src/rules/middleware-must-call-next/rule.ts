import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"

type MessageIds = "missingNextCall"

const DEFINE_MIDDLEWARES = "defineMiddlewares"

type MiddlewareFn =
  | TSESTree.ArrowFunctionExpression
  | TSESTree.FunctionExpression

function isMiddlewareFunctionNode(node: TSESTree.Node): node is MiddlewareFn {
  return (
    node.type === AST_NODE_TYPES.ArrowFunctionExpression ||
    node.type === AST_NODE_TYPES.FunctionExpression
  )
}

function getNextParamName(fn: MiddlewareFn): string | null {
  const third = fn.params[2]
  if (!third) {
    return null
  }
  if (third.type === AST_NODE_TYPES.Identifier) {
    return third.name
  }
  // Destructured / rest / assignment patterns aren't the canonical signature —
  // skip them so we don't false-positive on unusual middleware shapes.
  return null
}

function bodyReferencesIdentifier(body: TSESTree.Node, name: string): boolean {
  let found = false
  const stack: TSESTree.Node[] = [body]
  while (stack.length) {
    const node = stack.pop()!
    if (node.type === AST_NODE_TYPES.Identifier && node.name === name) {
      found = true
      break
    }
    for (const key of Object.keys(node) as Array<keyof typeof node>) {
      if (key === "parent") {
        continue
      }
      const value = (node as unknown as Record<string, unknown>)[key as string]
      if (!value) {
        continue
      }
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
  return found
}

function collectMiddlewareFunctions(
  objectArg: TSESTree.Node,
  out: MiddlewareFn[]
): void {
  const stack: TSESTree.Node[] = [objectArg]
  while (stack.length) {
    const node = stack.pop()!
    if (node.type === AST_NODE_TYPES.Property) {
      const key = node.key
      const isMiddlewaresKey =
        (key.type === AST_NODE_TYPES.Identifier &&
          key.name === "middlewares") ||
        (key.type === AST_NODE_TYPES.Literal && key.value === "middlewares")
      if (
        isMiddlewaresKey &&
        node.value.type === AST_NODE_TYPES.ArrayExpression
      ) {
        for (const el of node.value.elements) {
          if (el && isMiddlewareFunctionNode(el)) {
            out.push(el)
          }
        }
        continue
      }
    }
    for (const key of Object.keys(node) as Array<keyof typeof node>) {
      if (key === "parent") {
        continue
      }
      const value = (node as unknown as Record<string, unknown>)[key as string]
      if (!value) {
        continue
      }
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
  name: "middleware-must-call-next",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Middleware functions registered via `defineMiddlewares(...)` must reference their `next` parameter so the middleware chain continues.",
    },
    messages: {
      missingNextCall:
        "Middleware function never references `{{name}}`. Call `{{name}}()` (or end the response) so the middleware chain continues.",
    },
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
        if (!arg || arg.type !== AST_NODE_TYPES.ObjectExpression) {
          return
        }

        const fns: MiddlewareFn[] = []
        collectMiddlewareFunctions(arg, fns)

        for (const fn of fns) {
          const name = getNextParamName(fn)
          if (!name) {
            continue
          }
          if (!bodyReferencesIdentifier(fn.body, name)) {
            context.report({
              node: fn,
              messageId: "missingNextCall",
              data: { name },
            })
          }
        }
      },
    }
  },
})

export default rule
