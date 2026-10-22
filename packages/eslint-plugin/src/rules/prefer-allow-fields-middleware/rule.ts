import { createRule } from "../../create-rule"
import { ALLOW_FIELDS_MIN_MEDUSA_VERSION } from "../../constants"
import {
  collectMiddlewareRoutes,
  findAllowedMutation,
  getDefineMiddlewaresArg,
} from "../../util/middlewares"

type MessageIds = "preferAllowFields"

export const rule = createRule<[], MessageIds>({
  name: "prefer-allow-fields-middleware",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Middlewares that add allowed fields should use the `allowFields` middleware from `@medusajs/framework/http` instead of writing to `req.allowed`.",
    },
    messages: {
      preferAllowFields: `Use the \`allowFields\` middleware from \`@medusajs/framework/http\` instead of writing to \`req.allowed\`, for example \`middlewares: [allowFields("brand")]\`. \`allowFields\` requires Medusa v${ALLOW_FIELDS_MIN_MEDUSA_VERSION} or later, so keep this middleware if the project runs an earlier version.`,
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const arg = getDefineMiddlewaresArg(node)
        if (!arg) {
          return
        }

        for (const route of collectMiddlewareRoutes(arg)) {
          for (const middleware of route.middlewares) {
            const mutation = findAllowedMutation(middleware)
            if (mutation) {
              context.report({ node: mutation, messageId: "preferAllowFields" })
            }
          }
        }
      },
    }
  },
})

export default rule
