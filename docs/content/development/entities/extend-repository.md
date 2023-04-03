---
description: 'Learn how to extend a core repository in Medusa to add custom methods.'
addHowToData: true
---

# How to Extend a Repository

In this document, you’ll learn how to extend a core repository in Medusa.

## Overview

Medusa uses Typeorm’s Repositories to perform operations on an entity, such as retrieve or update the entity. Typeorm already provides these basic functionalities within a repository, but sometimes you need to implement a custom implementation to handle the logic behind these operations differently. You might also want to add custom methods related to processing entities that aren’t available in the default repositories.

In this guide, you’ll learn how to extend a repository in the core Medusa package. This guide will use the Product repository as an example to demonstrate the steps.

### Word of Caution about Overriding

Extending repositories to add new methods shouldn't cause any issues within your commerce application. However, if you extend them to override their existing methods, you should be aware that this could have negative implications, such as unanticipated bugs, especially when you try to upgrade the core Medusa package to a newer version.

---

## Step 1: Create Repository File

In your Medusa backend, create the file `src/repositories/product.ts`. This file will hold your extended repository.

Note that the name of the file must be the same as the name of the original repository in the core package. Since in this guide you’re extending the Product repository, it’s named `product` to match the core. If you’re extending the customer repository, for example, the file should be named `customer.ts`.

---

## Step 2: Implement Extended Repository

In the file you created, you must retrieve both the repository you're extending along with its entity from the core. You’ll then use the data source exported from the core package to extend the repository.

:::tip

A data source is Typeorm’s connection settings that allows you to connect to your database. You can learn more about it in [Typeorm’s documentation](https://typeorm.io/data-source).

:::

Here’s an example of the implementation of the extended Product repository:

```ts title=src/repositories/product.ts
import { Product } from "@medusajs/medusa"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"
import {
  // alias the core repository to not cause a naming conflict
  ProductRepository as MedusaProductRepository,
} from "@medusajs/medusa/dist/repositories/product"

export const ProductRepository = dataSource
  .getRepository(Product)
  .extend({
    // it is important to spread the existing repository here.
    //  Otherwise you will end up losing core properties
    ...MedusaProductRepository,

    /**
     * Here you can create your custom function
     * For example
     */
    customFunction(): void {
      // TODO add custom implementation
      return
    },
  })

export default ProductRepository
```

You first import all necessary resources from the core package: the `Product` entity, the `dataSource` instance, and the core’s `ProductRepository` aliased as `MedusaProductRepository` to avoid naming conflict.

You then use the `dataSource` instance to retrieve the `Product` entity’s repository and extend it using the repository’s `extend` method. This method is available as part of Typeorm Repository API. This method returns your extended repository.

The `extend` method accepts an object with all the methods to add to the extended repository.

You must first add the properties of the repository you’re extending, which in this case is the product repository (aliased as `MedusaProductRepository`). This will ensure you don’t lose core methods, which can lead to the core not working as expected. You add use the spread operator (`…`) with the `MedusaProductRepository` to spread its properties.

After that, you can add your custom methods to the repository. In the example above, you add the method `customFunction`. You can use any name for your methods.

---

## Step 3: Use Your Extended Repository

You can now use your extended repository in other resources such as services or endpoints.

Here’s an example of using it in an endpoint:

```ts
import ProductRepository from "./path/to/product.ts"
import EntityManager from "@medusajs/medusa"

export default () => {
  // ...

  router.get("/custom-endpoint", (req, res) => {
    // ...

    const productRepository: typeof ProductRepository = 
      req.scope.resolve(
        "productRepository"
      )
    const manager: EntityManager = req.scope.resolve("manager")
    const productRepo = manager.withRepository(
      productRepository
    )
    productRepo.customFunction()

    // ...
  })
}
```

---

## Step 4: Test Your Implementation

For changes to take effect, you must transpile your code by running the `build` command in the root of the Medusa backend:

```bash npm2yarn
npm run build
```

Then, run the following command to start your backend:

```bash npm2yarn
npm run start
```

You should see your custom implementation working as expected.
