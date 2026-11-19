import { defineMiddlewares } from "../../utils/define-middlewares"

export default defineMiddlewares({
  audit: { namespaces: ["/v1", "/v1/admin"] },
  routes: [{ matcher: "/v1*", methods: ["POST"], audit: true }],
})
