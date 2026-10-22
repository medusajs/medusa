import { createRule } from "../../create-rule"
import {
  collectMiddlewareRoutes,
  findAllowFieldsCall,
  findRequestFieldsMutation,
  getDefineMiddlewaresArg,
  RequestFieldsProperty,
} from "../../util/middlewares"

type MessageIds = "methodScoped"

const FIELDS_PROPERTIES: RequestFieldsProperty[] = ["allowed", "disallowed"]

export const rule = createRule<[], MessageIds>({
  name: "allow-fields-must-be-global-middleware",
  meta: {
    type: "problem",
    docs: {
      description:
        "Allowed and disallowed fields must be set by a global middleware. Medusa runs a method-scoped middleware after it validates the query parameters, so `allowFields`, `req.allowed`, and `req.disallowed` have no effect there.",
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

            for (const property of FIELDS_PROPERTIES) {
              const mutation = findRequestFieldsMutation(middleware, property)
              if (mutation) {
                context.report({
                  node: mutation,
                  messageId: "methodScoped",
                  data: { source: `req.${property}`, key },
                })
              }
            }
          }
        }
      },
    }
  },
})

export default rule
