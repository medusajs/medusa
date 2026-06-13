import * as path from "path"
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { isUnderApiDir } from "../../util/api-route"

type MessageIds = "noMutation"
type Options = [
  {
    allowedMutations?: string[]
    additionalMutationPrefixes?: string[]
  }?
]

const HTTP_METHODS = new Set([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
])

const ROUTE_FILE_BASENAMES = new Set(["route.ts", "route.tsx", "route.js"])

const DEFAULT_MUTATION_PREFIXES = [
  "create",
  "update",
  "delete",
  "softDelete",
  "restore",
  "upsert",
  "archive",
  "cancel",
  "complete",
  "capture",
  "refund",
  "authorize",
  "void",
  "add",
  "remove",
  "attach",
  "detach",
  "set",
  "reset",
  "generate",
  "issue",
  "revoke",
]

function buildMutationRegex(prefixes: string[]): RegExp {
  return new RegExp(`^(?:${prefixes.join("|")})(?:[A-Z_].*)?$`)
}

function isResolveCallee(callee: TSESTree.Node): boolean {
  return (
    callee.type === AST_NODE_TYPES.MemberExpression &&
    !callee.computed &&
    callee.property.type === AST_NODE_TYPES.Identifier &&
    callee.property.name === "resolve"
  )
}

function getHandlerFunctions(
  node: TSESTree.ExportNamedDeclaration
): TSESTree.Node[] {
  const out: TSESTree.Node[] = []
  const decl = node.declaration
  if (!decl) return out
  if (decl.type === AST_NODE_TYPES.VariableDeclaration) {
    for (const d of decl.declarations) {
      if (
        d.id.type === AST_NODE_TYPES.Identifier &&
        HTTP_METHODS.has(d.id.name) &&
        d.init &&
        (d.init.type === AST_NODE_TYPES.ArrowFunctionExpression ||
          d.init.type === AST_NODE_TYPES.FunctionExpression)
      ) {
        out.push(d.init)
      }
    }
  } else if (
    decl.type === AST_NODE_TYPES.FunctionDeclaration &&
    decl.id &&
    HTTP_METHODS.has(decl.id.name)
  ) {
    out.push(decl)
  }
  return out
}

function walk(node: TSESTree.Node, visit: (n: TSESTree.Node) => void): void {
  visit(node)
  for (const key of Object.keys(node) as Array<keyof typeof node>) {
    if (key === "parent") continue
    const value = (node as unknown as Record<string, unknown>)[key as string]
    if (!value) continue
    if (Array.isArray(value)) {
      for (const child of value) {
        if (child && typeof child === "object" && "type" in child) {
          walk(child as TSESTree.Node, visit)
        }
      }
    } else if (
      typeof value === "object" &&
      "type" in (value as object)
    ) {
      walk(value as TSESTree.Node, visit)
    }
  }
}

export const rule = createRule<Options, MessageIds>({
  name: "no-service-mutations-in-api-route",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Don't call service mutation methods directly from API route handlers; use a workflow instead.",
    },
    messages: {
      noMutation:
        "Avoid calling `{{service}}.{{method}}(...)` directly in an API route handler. Move the mutation into a workflow step and invoke it via `someWorkflow(req.scope).run({ input })`.",
    },
    schema: [
      {
        type: "object",
        additionalProperties: false,
        properties: {
          allowedMutations: {
            type: "array",
            items: { type: "string" },
          },
          additionalMutationPrefixes: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    ],
  },
  defaultOptions: [{}],
  create(context, [options]) {
    const filename = context.filename
    if (!filename || filename.startsWith("<")) return {}
    if (!isUnderApiDir(filename)) return {}
    if (!ROUTE_FILE_BASENAMES.has(path.basename(filename))) return {}

    const allowed = new Set(options?.allowedMutations ?? [])
    const mutationRegex = buildMutationRegex([
      ...DEFAULT_MUTATION_PREFIXES,
      ...(options?.additionalMutationPrefixes ?? []),
    ])

    const handlerFns: TSESTree.Node[] = []

    return {
      ExportNamedDeclaration(node) {
        for (const fn of getHandlerFunctions(node)) {
          handlerFns.push(fn)
        }
      },
      "Program:exit"() {
        for (const fn of handlerFns) {
          const body = (fn as TSESTree.FunctionLike).body
          if (!body) continue
          const tracked = new Set<string>()

          walk(body as TSESTree.Node, (n) => {
            if (
              n.type !== AST_NODE_TYPES.VariableDeclarator ||
              n.id.type !== AST_NODE_TYPES.Identifier ||
              !n.init
            ) {
              return
            }
            // Unwrap `await ...` to support `const x = await scope.resolve(...)`
            // (resolve() is sync, but users sometimes await it.)
            let init: TSESTree.Node = n.init
            if (init.type === AST_NODE_TYPES.AwaitExpression) {
              init = init.argument
            }
            if (
              init.type !== AST_NODE_TYPES.CallExpression ||
              !isResolveCallee(init.callee)
            ) {
              return
            }
            tracked.add(n.id.name)
          })

          if (tracked.size === 0) continue

          walk(body as TSESTree.Node, (n) => {
            if (n.type !== AST_NODE_TYPES.CallExpression) return
            const callee = n.callee
            if (
              callee.type !== AST_NODE_TYPES.MemberExpression ||
              callee.computed ||
              callee.object.type !== AST_NODE_TYPES.Identifier ||
              callee.property.type !== AST_NODE_TYPES.Identifier
            ) {
              return
            }
            if (!tracked.has(callee.object.name)) return
            const method = callee.property.name
            if (allowed.has(method)) return
            if (!mutationRegex.test(method)) return
            context.report({
              node: callee,
              messageId: "noMutation",
              data: {
                service: callee.object.name,
                method,
              },
            })
          })
        }
      },
    }
  },
})

export default rule
