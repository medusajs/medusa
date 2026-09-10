import { createRule } from "../../create-rule"
import {
  collectMiddlewareRoutes,
  findAllowFieldsCall,
  findAllowedMutation,
  getDefineMiddlewaresArg,
} from "../../util/middlewares"

type MessageIds = "methodScoped"

export const rule = createRule<[], MessageIds>({
  name: "allow-fields-must-be-global-middleware",
  meta: {
    type: "problem",
    docs: {
      description:
        "Allowed fields must be added by a global middleware. Medusa runs a method-scoped middleware after it validates the query parameters, so `allowFields` and `req.allowed` have no effect there.",
    },
    messages: {
      methodScoped:
        "`{{source}}` has no effect in a middleware scoped with `{{key}}`, since Medusa validates the query parameters before it runs. Remove the `{{key}}` property so the middleware applies to every request that matches the route.",
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
          const methodProperty = route.methodProperty
          if (!methodProperty) {
            continue
          }

          const key =
            methodProperty.key.type === "Identifier"
              ? methodProperty.key.name
              : "method"

          for (const middleware of route.middlewares) {
            const allowFieldsCall = findAllowFieldsCall(middleware)
            if (allowFieldsCall) {
              context.report({
                node: allowFieldsCall,
                messageId: "methodScoped",
                data: { source: "allowFields", key },
              })
              continue
            }

            const mutation = findAllowedMutation(middleware)
            if (mutation) {
              context.report({
                node: mutation,
                messageId: "methodScoped",
                data: { source: "req.allowed", key },
              })
            }
          }
        }
      },
    }
  },
})

export default rule
