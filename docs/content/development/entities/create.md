---
description: 'Learn how to create an entity in Medusa. This guide also explains how to create a repository and access and delete the entity.'
addHowToData: true
---

# How to Create an Entity

In this document, you’ll learn how you can create a custom [Entity](./overview.mdx).

## Step 1: Create the Entity

To create an entity, create a TypeScript file in `src/models`. For example, here’s a `Post` entity defined in the file `src/models/post.ts`:

```ts title=src/models/post.ts
import { 
  BeforeInsert, 
  Column, 
  Entity, 
  PrimaryColumn,
} from "typeorm"
import { BaseEntity } from "@medusajs/medusa"
import { generateEntityId } from "@medusajs/medusa/dist/utils"

@Entity()
export class Post extends BaseEntity {
  @Column({ type: "varchar" })
  title: string | null

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

```ts
import { SoftDeletableEntity } from "@medusajs/medusa"

@Entity()
export class Post extends SoftDeletableEntity {
  // ...
}
```

You can learn more about what decorators and column types you can use in [Typeorm’s documentation](https://typeorm.io/entities).

---

## Step 2: Create a Migration

Additionally, you must create a migration for your entity. Migrations are used to update the database schema with new tables or changes to existing tables.

You can learn more about Migrations, how to create or generate them, and how to run them in the [Migration documentation](./migrations/overview.mdx).

---

## Step 3: Create a Repository

Entities data can be easily accessed and modified using Typeorm [Repositories](https://typeorm.io/working-with-repository). To create a repository, create a file in `src/repositories`. For example, here’s a repository `PostRepository` created in `src/repositories/post.ts`:

```ts title=src/repositories/post.ts
import { Post } from "../models/post"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const PostRepository = dataSource
  .getRepository(Post)

export default PostRepository
```

The repository is created using the `getRepository` method of the data source exported from the core package in Medusa. This method accepts the entity as a parameter.

:::tip

A data source is Typeorm’s connection settings that allows you to connect to your database. You can learn more about it in [Typeorm’s documentation](https://typeorm.io/data-source).

:::

If you want to add methods to that repository or override Typeorm's Repository methods, you can do that using the `extend` method:

```ts title=src/repositories/post.ts
import { Post } from "../models/post"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const PostRepository = dataSource
  .getRepository(Post)
  .extend({
    customFunction(): void {
      // TODO add custom implementation
      return
    },
  })

export default PostRepository
```

You can learn about available Repository methods in [Typeorm's documentation](https://typeorm.io/repository-api).

---

## Step 4: Run Migrations

Before you start using your entity, make sure to run the migrations that reflect the entity on your database schema.

To do that, run the `build` command that transpiles your code:

```bash npm2yarn
npm run build
```

Then, run the `migration` command:

```bash npm2yarn
medusa migrations run
```

You should see that your migration have executed.

---

## Step 5: Use Your Entity

You can access your custom entity data in the database in services or subscribers using the repository. For example, here’s a service that lists all posts:

```ts
import { TransactionBaseService } from "@medusajs/medusa"

class PostService extends TransactionBaseService {
  constructor({ postRepository, manager }) {
    super({ postRepository, manager })

    this.postRepository = postRepository
    this.manager_ = manager
  }

  async list() {
    const postRepo = this.manager_
      .withRepository(this.postRepository)
    return await postRepo.find()
  }
}

export default PostService
```

In the constructor, you can use dependency injection to get access to instances of services and repositories. Here, you initialize class fields `postRepository` and `manager`. The `manager` is a [Typeorm Entity Manager](https://typeorm.io/working-with-entity-manager).

Then, in the method `list`, you can create an instance of the `PostRepository` using the `this.manager_.withRepository` method passing it `this.postRepository` as a parameter.

After getting an instance of the repository, you can then use [Typeorm’s Repository methods](https://typeorm.io/repository-api) to perform Create, Read, Update, and Delete (CRUD) operations on your entity. You can also use any custom methods that you defined in the Repository.

:::note

This same usage of repositories can be done in other resources such as subscribers or endpoints.

:::

### Delete a Soft-Deletable Entity

To delete soft-deletable entities that extend the `SoftDeletableEntity` class, you can use the repository method `softDelete` method:

```ts
await postRepository.softDelete(post.id)
```

---

## See Also

- [Extend Entity](./extend-entity.md)
- [Create a Plugin](../plugins/create.md)
