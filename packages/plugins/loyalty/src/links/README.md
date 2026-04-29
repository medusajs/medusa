# Module Links

A module link forms an association between two data models of different modules, while maintaining module isolation.

For example:

```ts
import HelloModule from "../modules/hello"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  ProductModule.linkable.product,
  HelloModule.linkable.myCustom
)
```

This defines a link between the Product Module's `product` data model and the Hello Module (custom module)'s `myCustom` data model.

Learn more about links in [this documentation](https://docs.medusajs.com/learn/fundamentals/module-links)