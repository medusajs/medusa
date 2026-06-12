import { createRule } from "../../create-rule"
import { toPosix } from "../../util/filename"
import { getApiRouteSegments } from "../../util/api-route"

type MessageIds = "invalidDynamicFolder" | "leadingDynamicFolder"

const VALID_PARAM_FOLDER = /^\[[a-zA-Z_][a-zA-Z0-9_]*\]$/
const BRACKETED_FOLDER = /^\[.*\]$/

const API_ROUTE_GROUPS = new Set(["store", "admin", "auth"])

type RouteInfo = {
  segments: string[]
  routeStartIndex: number
}

function getRouteInfo(filename: string): RouteInfo | null {
  const apiSegments = getApiRouteSegments(filename)
  if (apiSegments) {
    const routeStartIndex =
      apiSegments.length > 0 && API_ROUTE_GROUPS.has(apiSegments[0]) ? 1 : 0
    return { segments: apiSegments, routeStartIndex }
  }

  const posix = toPosix(filename)
  const adminMatch =
    posix.match(/(?:^|\/)src\/admin\/routes\/(.+)$/) ??
    posix.match(/(?:^|\/)admin\/routes\/(.+)$/)

  if (adminMatch) {
    const segments = adminMatch[1].split("/")
    segments.pop()
    return { segments, routeStartIndex: 0 }
  }

  return null
}

export const rule = createRule<[], MessageIds>({
  name: "route-dynamic-folder-syntax",
  meta: {
    type: "problem",
    docs: {
      description:
        "Dynamic route parameters must use `[param]` folder syntax and cannot appear as the first segment of a route.",
    },
    messages: {
      invalidDynamicFolder:
        "Invalid dynamic route folder `{{segment}}`. Medusa only recognizes `[param]` (single brackets, identifier name).",
      leadingDynamicFolder:
        "Route cannot start with a dynamic segment `{{segment}}`. Add a static prefix segment before it.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename
    if (!filename || filename.startsWith("<")) return {}

    const info = getRouteInfo(filename)
    if (!info) return {}

    return {
      Program(node) {
        const { segments, routeStartIndex } = info
        for (let i = 0; i < segments.length; i++) {
          const segment = segments[i]
          if (!BRACKETED_FOLDER.test(segment)) continue

          if (!VALID_PARAM_FOLDER.test(segment)) {
            context.report({
              node,
              messageId: "invalidDynamicFolder",
              data: { segment },
            })
            continue
          }

          if (i === routeStartIndex) {
            context.report({
              node,
              messageId: "leadingDynamicFolder",
              data: { segment },
            })
          }
        }
      },
    }
  },
})

export default rule
