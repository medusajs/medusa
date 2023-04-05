---
description: 'Learn how to extend a core entity in Medusa to add custom attributes.'
addHowToData: true
---

# How to Extend an Entity

In this document, you’ll learn how to extend a core entity in Medusa.

## Overview

Medusa uses entities to represent tables in the database. As you build your custom commerce application, you’ll often need to add your own properties to those entities. This guide explains the necessary steps to extend core Medusa entities.

This guide will use the Product entity as an example to demonstrate the steps.

### Word of Caution about Overriding

Extending entities to add new attributes or methods shouldn't cause any issues within your commerce application. However, if you extend them to override their existing methods or attributes, you should be aware that this could have negative implications, such as unanticipated bugs, especially when you try to upgrade the core Medusa package to a newer version.

---

## Step 1: Create Entity File

In your Medusa backend, create the file `src/models/product.ts`. This file will hold your extended entity.

Note that the name of the file must be the same as the name of the original entity in the core package. Since in this guide you’re overriding the Product entity, it’s named `product` to match the core. If you’re extending the customer entity, for example, the file should be named `customer.ts`.

---

## Step 2: Implement Extended Entity

In the file you created, you can import the entity you’re extending from the core package, then create a class that extends that entity. You can add in that class the new attributes and methods.

Here’s an example of extending the Product entity:

```ts title=src/models/product.ts
import { Column, Entity } from "typeorm"
import {
  // alias the core entity to not cause a naming conflict
  Product as MedusaProduct,
} from "@medusajs/medusa"

@Entity()
export class Product extends MedusaProduct {
  @Column()
  customAttribute: string
}
```

---

## (Optional) Step 3: Create a TypeScript Declaration File

If you’re using JavaScript instead of TypeScript in your implementation, you can skip this step.

To ensure that TypeScript is aware of your extended entity and affects the typing of the Medusa package itself, create the file `src/index.d.ts` with the following content:

```ts title=src/index.d.ts
export declare module "@medusajs/medusa/dist/models/product" {
  declare interface Product {
    customAttribute: string;
  }
}
```

Notice that you must pass the attributes you added to the entity into the `interface`. The attributes will be merged with the attributes defined in the core `Product` entity.

---

## Step 4: Extend Repository

As the entity is used throughout the commerce application through its repository, the core package will not actually be aware that the entity was extended unless you also extend the repository.

The steps here are similar to those described in the [How to Extend a Repository documentation](./extend-repository.md), however, the implementation is a little different.

Start by creating the repository file `src/repositories/product.ts`. As mentioned in the repository documentation, the name of the file should be the same as the name in the core. So, if you’re extending another repository, use the file name of that repository instead.

Then, in the file, add the following content:

```ts title=src/repositories/product.ts
import { Product } from "../models/product"
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
    // Otherwise you will end up losing core properties.
    // you also update the target to the extended entity
    ...Object.assign(
      MedusaProductRepository, 
      { target: Product }
    ),
      
    // you can add other customizations as well...
  })

export default ProductRepository
```

Instead of just spreading the properties of the `MedusaProductRepository` as you did when extending a repository, you have to change the value of the `target` property to be the entity you created.

---

## Step 5: Create Migration

To reflect your entity changes on the database schema, you must create a migration with those changes.

You can learn how to create or generate a migration in [this documentation](./migrations/create.md).

Here’s an example of a migration of the entity extended in this guide:

```ts title=src/migration/1680013376180-changeProduct.ts
import { MigrationInterface, QueryRunner } from "typeorm"

class changeProduct1680013376180 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE \"product\"" + 
      " ADD COLUMN \"customAttribute\" text"
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE \"product\" DROP COLUMN \"customAttribute\""
    )
  }
}

export default changeProduct1680013376180
```

---

## Step 6: Use Custom Entity

For changes to take effect, you must transpile your code by running the `build` command in the root of the Medusa backend:

```bash npm2yarn
npm run build
```

Then, run the following command to migrate your changes to the database:

```bash npm2yarn
medusa migrations run
```

You should see that your migration was executed, which means your changes were reflected in the database schema.

You can now use your extended entity and its repository throughout your commerce application.
