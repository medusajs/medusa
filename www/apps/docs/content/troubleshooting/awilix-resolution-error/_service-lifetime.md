If you're registering a custom resource within a middleware, for example a logged-in user, then make sure that all services that are using it have their `LIFE_TIME` static property either set to `Lifetime.SCOPED` or `Lifetime.TRANSIENT`. This mainly applies for services in the core Medusa package, as, by default, their lifetime is `Lifetime.SINGLETON`.

For example:

```ts
import { Lifetime } from "awilix"
import { 
  ProductService as MedusaProductService,
} from "@medusajs/medusa"

// extending ProductService from the core
class ProductService extends MedusaProductService {
  // The default life time for a core service is SINGLETON
  static LIFE_TIME = Lifetime.SCOPED

  // ...
}

export default ProductService
```

This may require you to extend a service as explained in [this documentation](../../development/services/extend-service.mdx) if necessary.

If you're unsure which service you need to change its `LIFE_TIME` property, it should be mentioned along with the `AwilixResolutionError` message. For example:

```bash noCopy noReport
AwilixResolutionError: Could not resolve 'loggedInUser'.

Resolution path: cartService -> productService -> loggedInUser
```

As shown in the resolution path, you must change the `LIFE_TIME` property of both `cartService` and `productService` to `Lifetime.SCOPED` or `Lifetime.TRANSIENT`.

You can learn about the service lifetime in the [Create a Service documentation](../../development/services/create-service.mdx).