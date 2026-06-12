import * as path from "path"
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { getApiRouteSegments } from "../../util/api-route"

type MessageIds = "unknownRouteParam"

const VALID_PARAM_FOLDER = /^\[([a-zA-Z_][a-zA-Z0-9_]*)\]$/
const ROUTE_FILE_BASENAMES = new Set(["route.ts", "route.js"])

function collectParams(segments: string[]): Set<string> {
  const params = new Set<string>()
  for (const segment of segments) {
    const m = segment.match(VALID_PARAM_FOLDER)
    if (m) params.add(m[1])
  }
  return params
}

function isReqParams(node: TSESTree.Node): boolean {
  return (
    node.type === AST_NODE_TYPES.MemberExpression &&
    !node.computed &&
    node.object.type === AST_NODE_TYPES.Identifier &&
    node.object.name === "req" &&
    node.property.type === AST_NODE_TYPES.Identifier &&
    node.property.name === "params"
  )
}

export const rule = createRule<[], MessageIds>({
  name: "route-params-must-be-defined",
  meta: {
    type: "problem",
    docs: {
      description:
        "Properties accessed on `req.params` in an API route handler must correspond to a `[param]` folder in the route path.",
    },
    messages: {
      unknownRouteParam:
        "Route parameter `{{name}}` is not defined in the route path. Available params: {{available}}.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename
    if (!filename || filename.startsWith("<")) return {}
    if (!ROUTE_FILE_BASENAMES.has(path.basename(filename))) return {}

    const segments = getApiRouteSegments(filename)
    if (!segments) return {}

    const params = collectParams(segments)
    const available = params.size
      ? Array.from(params)
          .map((p) => `\`${p}\``)
          .join(", ")
      : "(none)"

    function report(node: TSESTree.Node, name: string) {
      if (params.has(name)) return
      context.report({
        node,
        messageId: "unknownRouteParam",
        data: { name, available },
      })
    }

    return {
      MemberExpression(node) {
        if (!isReqParams(node.object)) return
        if (node.computed) {
          const prop = node.property
          if (
            prop.type === AST_NODE_TYPES.Literal &&
            typeof prop.value === "string"
          ) {
            report(prop, prop.value)
          }
          return
        }
        if (node.property.type === AST_NODE_TYPES.Identifier) {
          report(node.property, node.property.name)
        }
      },
      VariableDeclarator(node) {
        if (!node.init || !isReqParams(node.init)) return
        if (node.id.type !== AST_NODE_TYPES.ObjectPattern) return
        for (const prop of node.id.properties) {
          if (prop.type !== AST_NODE_TYPES.Property) continue
          if (prop.computed) continue
          const key = prop.key
          if (key.type === AST_NODE_TYPES.Identifier) {
            report(key, key.name)
          } else if (
            key.type === AST_NODE_TYPES.Literal &&
            typeof key.value === "string"
          ) {
            report(key, key.value)
          }
        }
      },
    }
  },
})

export default rule
