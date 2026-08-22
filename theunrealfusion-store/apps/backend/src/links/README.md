# Module Links

A module link forms an association between two data models of different modules, while maintaining module isolation.

> Learn more about links in [this documentation](https://docs.medusajs.com/learn/fundamentals/module-links)

For example:

```ts
import BlogModule from "../modules/blog"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  ProductModule.linkable.product,
  BlogModule.linkable.post
)
```

This defines a link between the Product Module's `product` data model and the Blog Module (custom module)'s `post` data model.

Then, in the Medusa application, run the following command to sync the links to the database:

```bash
npx medusa db:migrate
```