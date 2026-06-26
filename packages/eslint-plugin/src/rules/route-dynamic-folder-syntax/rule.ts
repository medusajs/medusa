import { createRule } from "../../create-rule"
import { toPosix } from "../../util/filename"
import { getApiRouteSegments } from "../../util/api-route"

type MessageIds = "invalidDynamicFolder" | "leadingDynamicFolder"

const VALID_PARAM_FOLDER = /^\[[a-zA-Z_][a-zA-Z0-9_]*\]$/
const BRACKETED_FOLDER = /^\[.*\]$/

/**
 * Returns the route's path segments (excluding the `route.ts` / `page.tsx`
 * file), relative to the route root — `src/api/` for API routes (so the first
 * segment is the first path part after `/api`, regardless of any group such as
 * `store`/`admin`/`auth`/custom), or `src/admin/routes/` for admin UI routes.
 * Returns `null` when the file isn't a route.
 *
 * A dynamic segment at index 0 therefore means the route starts with a
 * parameter, which Medusa doesn't allow.
 */
function getRouteSegments(filename: string): string[] | null {
  const apiSegments = getApiRouteSegments(filename)
  if (apiSegments) {
    return apiSegments
  }

  const posix = toPosix(filename)
  const adminMatch =
    posix.match(/(?:^|\/)src\/admin\/routes\/(.+)$/) ??
    posix.match(/(?:^|\/)admin\/routes\/(.+)$/)

  if (adminMatch) {
    const segments = adminMatch[1].split("/")
    segments.pop()
    return segments
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
    if (!filename || filename.startsWith("<")) {
      return {}
    }

    const segments = getRouteSegments(filename)
    if (!segments) {
      return {}
    }

    return {
      Program(node) {
        for (let i = 0; i < segments.length; i++) {
          const segment = segments[i]
          if (!BRACKETED_FOLDER.test(segment)) {
            continue
          }

          if (!VALID_PARAM_FOLDER.test(segment)) {
            context.report({
              node,
              messageId: "invalidDynamicFolder",
              data: { segment },
            })
            continue
          }

          if (i === 0) {
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
