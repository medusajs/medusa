# How to Create Entities

In this document, you’ll learn about entities in Medusa and how you can create your own entity.

## Overview

Entities in medusa represent tables in the database as classes. An example of this would be the `Order` entity which represents the `order` table in the database. Entities provide a uniform way of defining and interacting with data retrieved from the database.

Aside from Medusa’s core entities, you can also create your own entities to use in your Medusa server. Custom entities must reside in the `src/models` directory of your Medusa server.

Entities are TypeScript files and they are based on [Typeorm’s Entities](https://typeorm.io/entities) and use Typeorm decorators.

All entities must extend either the `BaseEntity` or `SoftDeletableEntity` classes. The `BaseEntity` class holds common columns including the `id`, `created_at`, and `updated_at` columns.

The `SoftDeletableEntity` class extends the `BaseEntity` class and adds another column `deleted_at`. If an entity can be soft deleted, meaning that a row in it can appear to the user as deleted but still be available in the database, it should extend `SoftDeletableEntity`.

## How to Create a Custom Entity

### Prerequisites

It’s recommended to create a `tsconfig.json` file in the root of your Medusa server with the following content:

```jsx
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

This will remove any errors that show up in your IDE related to experimental decorators.

### Create the Entity

To create an entity, create a TypeScript file in `src/models`. For example, here’s a `Post` entity defined in the file `src/models/post.ts`:

```tsx
import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm";
import { BaseEntity} from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils"

@Entity()
export class Post extends BaseEntity {
  @Column({type: 'varchar'})
  title: string | null;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "post")
  }
}
```

This entity has one column `title` defined. However, since it extends `BaseEntity` it will also have the `id`, `created_at`, and `updated_at` columns.

Medusa’s core entities all have the following format for IDs: `<PREFIX>_<RANDOM>`. For example, an order might have the ID `order_01G35WVGY4D1JCA4TPGVXPGCQM`.

To generate an ID for your entity that matches the IDs generated for Medusa’s core entities, you should add a `BeforeInsert` event handler. Then, inside that handler use Medusa’s utility function `generateEntityId` to generate the ID. It accepts the ID as a first parameter and the prefix as a second parameter. The `Post` entity IDs will be of the format `post_<RANDOM>`.

If you want the entity to also be soft deletable then it should extend `SoftDeletableEntity` instead:

```tsx
import { SoftDeletableEntity } from "@medusajs/medusa";

@Entity()
export class Post extends SoftDeletableEntity {
  //...
}
```

You can learn more about what decorators and column types you can use in [Typeorm’s documentation](https://typeorm.io/entities).

### Create the Migration

Additionally, you must create a migration for your entity. Migrations are used to update the database schema with new tables or changes to existing tables.

You can learn more about Migrations, how to create them, and how to run them in the [Migration documentation](migrations.md).

### Create a Repository

Entities data can be easily accessed and modified using Typeorm [Repositories](https://typeorm.io/working-with-repository). To create a repository, create a file in `src/repositories`. For example, here’s a repository `PostRepository` that resides in `src/repositories/post.ts`:

```tsx
import { EntityRepository, Repository } from "typeorm"

import { Post } from "../models/post"

@EntityRepository(Post)
export class PostRepository extends Repository<Post> { }
```

This repository is created for the `Post` and that is indicated using the decorator `@EntityRepository`.

:::tip

Be careful with your file names as it can cause unclear errors in Typeorm. Make sure all your file names are small letters for both entities and repositories to avoid any issues with file names.

:::

## Access Your Custom Entity

:::note

Before trying this step make sure that you’ve created and run your migrations. You also need to re-build your code using:

```bash npm2yarn
npm run build
```

:::

You can access your custom entity data in the database in services or subscribers using the repository. For example, here’s a service that lists all posts:

```tsx
import { TransactionBaseService } from "medusa-interfaces";

class PostService extends TransactionBaseService {
  constructor({ postRepository, manager }) {
    super({ postRepository, manager });

    this.postRepository = postRepository;
    this.manager_ = manager;
  }

  async list() {
    const postRepository = this.manager_.getCustomRepository(this.postRepository);
    return await postRepository.find();
  }
}

export default PostService;
```

In the constructor, you can use dependency injection to get access to instances of services and repositories. Here, you initialize class fields `postRepository` and `manager`. The `manager` is a [Typeorm Entity Manager](https://typeorm.io/working-with-entity-manager).

Then, in the method `list`, you can obtain an instance of the `PostRepository` using `this.manager_.getCustomRepository` passing it `this.postRepository` as a parameter. This lets you use [Custom Repositories with Typeorm](https://typeorm.io/custom-repository) to create custom methods in your repository that work with the data in your database.

After getting an instance of the repository, you can then use [Typeorm’s Repository methods](https://typeorm.io/repository-api) to perform CRUD (Create, Read, Update, Delete) operations on your entity.

If you need access to your entity in endpoints, you can then use the methods you define in the service.

:::note

This same usage of repositories can be done in subscribers as well.

:::

### Deleting Soft-Deletable Entities

To delete soft-deletable entities that extend the `SoftDeletableEntity` class, you can use the repository method `softDelete` method:

```tsx
await postRepository.softDelete(post.id);
```

## What’s Next 🚀

- Learn more about [Services](services/create-service.md) and how to use them.
- Learn how to create an endpoint for [storefront](endpoints/add-storefront.md) and [admin](endpoints/add-admin.md).
- Learn about [migrations](migrations.md).