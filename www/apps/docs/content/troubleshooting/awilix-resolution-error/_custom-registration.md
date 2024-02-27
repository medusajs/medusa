When you register a custom resource using a middleware, make sure that when you use it in a service's constructor you wrap it in a try-catch block. This can cause an error when the Medusa backend first runs, especially if the service is used within a subscriber. Subscribers are built the first time the Medusa backend runs, meaning that their dependencies are registered at that point. Since your custom resource hasn't been registered at this point, it will cause an `AwilixResolutionError` when the backend tries to resolve it.

For that reason, and to avoid other similar situations, make sure to always wrap your custom resources in a try-catch block when you use them inside the constructor of a service. For example:

<!-- eslint-disable prefer-rest-params -->

```ts
import { TransactionBaseService } from "@medusajs/medusa"

class CustomService extends TransactionBaseService {

  constructor(container, options) {
    super(...arguments)

    // use the registered resource.
    try {
      container.customResource
    } catch (e) {
      // avoid errors when the backend first loads
    }
  }
}

export default CustomService
```

You can learn more about this in the [Middlewares documentation](../../development/api-routes/add-middleware.mdx).
