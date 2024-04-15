---
description: "In this document, you'll learn what repositories are, how to use them within your Medusa backend, and what are some of their common methods."
---

# Repositories

In this document, you'll learn what repositories are, how to use them within your Medusa backend, and what are some of their common methods.

## Overview

Repositories provide generic helper methods for entities. For example, you can use the `find` method to retrieve all entities with pagination, or `findOne` to retrieve a single entity record.

Repositories are [Typeorm repositories](https://typeorm.io/working-with-repository), so you can refer to Typeorm's documentation on all available methods.

By default, you don't need to create a repository for your custom entities. You can retrieve the default repository of an entity using the Entity Manager. You should only create a repository if you want to implement custom methods in it.

---

## Access Default Repository

If you haven't created a custom repository, you can access the default repository using the [Entity Manager](https://typeorm.io/entity-manager-api). The Entity Manager is registered in the [dependency container](../fundamentals/dependency-injection.md) under the name `manager`. So, you can [resolve it](../fundamentals/dependency-injection.md#resolve-resources) and use its method `getRepository` to retrieve the repository of an entity.

For example, to retrieve the default repository of an entity in a service:

```ts title="src/services/post.ts"
import { Post } from "../models/post"

class PostService extends TransactionBaseService {
  // ...

  async list(): Promise<Post[]> {
    const postRepo = this.activeManager_.getRepository(
      Post
    )
    return await postRepo.find()
  }

  // ...
}
```

Another example is retrieving the default repository of an entity in an API Route:

```ts title="src/api/store/custom/route.ts"
import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/medusa"
import { Post } from "../models/post"
import { EntityManager } from "typeorm"

export const GET = async (
  req: MedusaRequest, 
  res: MedusaResponse
) => {
  const manager: EntityManager = req.scope.resolve("manager")
  const postRepo = manager.getRepository(Post)

  return res.json({
    posts: await postRepo.find(),
  })
}
```

---

## Create Custom Repository

If you want to add custom methods or override existing methods in a repository, you can create a custom repository.

Repositories are created under the `src/repositories` directory of your Medusa backend project. The file name is the name of the repository without `Repository`.

For example, to create a repository for a `Post` entity, create the file `src/repositories/post.ts` with the following content:

```ts src=src/repositories/post.ts
import { Post } from "../models/post"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const PostRepository = dataSource
  .getRepository(Post)
  .extend({
    customMethod(): void {
      // TODO add custom implementation
      return
    },
  })

export default PostRepository
```

The repository is created using the `getRepository` method of the data source exported from the core package in Medusa. This method accepts the entity as a parameter. You then use the `extend` method to add a new method `customMethod`.

You can learn about available Repository methods that you can override in [Typeorm's documentation](https://typeorm.io/repository-api).

:::tip

A data source is Typeorm’s connection settings that allows you to connect to your database. You can learn more about it in [Typeorm’s documentation](https://typeorm.io/data-source).

:::

---

## Using Custom Repositories in Other Resources

### API Routes

To access a custom repository within an API Route, use the `MedusaRequest` object's `scope.resolve` method.

For example:

```ts title="src/store/custom/route.ts"
import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/medusa"
import { PostRepository } from "../repositories/post"
import { EntityManager } from "typeorm"

export const GET = async (
  req: MedusaRequest, 
  res: MedusaResponse
) => {
  const postRepository: typeof PostRepository = 
    req.scope.resolve("postRepository")
  const manager: EntityManager = req.scope.resolve("manager")
  const postRepo = manager.withRepository(postRepository)

  return res.json({
    posts: await postRepo.find(),
  })
}
```

You can learn more about API Route [here](../api-routes/overview.mdx).

### Services

As custom repositories are registered in the [dependency container](../fundamentals/dependency-injection.md#dependency-container-and-injection), they can be accessed through dependency injection in the constructor of a service.

For example:

```ts title="src/services/post.ts"
import { PostRepository } from "../repositories/post"

class PostService extends TransactionBaseService {
  // ...
  protected postRepository_: typeof PostRepository

  constructor(container) {
    super(container)
    // ...
    this.postRepository_ = container.postRepository
  }

  async list(): Promise<Post[]> {
    const postRepo = this.activeManager_.withRepository(
      this.postRepository_
    )
    return await postRepo.find()
  }

  // ...
}
```

You can learn more about services [here](../services/overview.mdx).

### Subscribers

A subscriber handler function can resolve a repository using the `container` property of its parameter. The `container` has a method `resolve` which accepts the registration name of the repository as a parameter.

For example:

```ts title="src/subscribers/post-handler.ts"
import {
  type SubscriberArgs,
} from "@medusajs/medusa"

import { PostRepository } from "../repositories/post"

export default async function postHandler({ 
  data, eventName, container, pluginOptions, 
}: SubscriberArgs) {
  const postRepository: PostRepository = container.resolve(
    "postRepository"
  )
  
  // ...
}

// ...
```

### Other Resources

Resources that have access to the dependency container can access repositories just like any other resources. You can learn more about the dependency container and dependency injection in [this documentation](../fundamentals/dependency-injection.md).

---

## Common Methods

This section covers some common methods and use cases you'll use with repositories. You can refer to [Typeorm's documentation](https://typeorm.io/repository-api) for full details on available methods.

### Retrieving a List of Records

To retrieve a list of records of an entity, use the `find` method:

```ts
const posts = await postRepository.find()
```

#### Pass Filters

You can also filter the retrieved items by passing an object of type [FindOption](https://typeorm.io/find-options) as a first parameter:

```ts
const posts = await postRepository.find({
  where: {
    id: "1",
  },
})
```

#### Configure Pagination

In addition, you can pass `skip` and `take` properties to the object for pagination purposes. `skip`'s value is a number that indicates how many items to skip before retrieving the results, and `take` indicates how many items to return:

```ts
const posts = await postRepository.find({
  skip: 0,
  take: 20,
})
```

#### Expand Relations

To expand relations and retrieve them as part of each item in the result, you can pass the `relations` property to the parameter object:

```ts
const posts = await postRepository.find({
  relations: ["authors"],
})
```

To expand nested relations (a relation of another relation), use dot notation:

```ts
const posts = await postRepository.find({
  relations: ["authors.posts"],
})
```

#### buildQuery Utility Method

Medusa provides a utility method `buildQuery` that allows you to easily format the object to pass to the `find` method. `buildQuery` accepts two parameters:

1. The first parameter is an object whose keys are the attributes of the entity, and their values are the value to filter by.
2. The second parameter includes the options related to pagination (such as `skip` and `take`), the relations to expand, and fields to select in each returned item.

For example:

```ts
import { buildQuery } from "@medusajs/medusa"

// ...
const selector = {
  id: "1",
}

const config = {
  skip: 0,
  take: 20,
  relations: ["authors"],
  select: ["title"],
}

const query = buildQuery(selector, config)

const posts = await postRepository.find(query)
```

### Retrieving a List of Records with Count

You can retrieve a list of records along with their count using the `findAndCount` method:

```ts
const [posts, count] = await postRepository.findAndCount()
```

This method also accepts the same options object as a parameter similar to the [find](#retrieving-a-list-of-records) method.

### Retrieving a Single Record

You can retrieve one record of an entity using the `findOne` method:

```ts
const post = await postRepository.findOne({
  where: {
    id: "1",
  },
})
```

If the record does not exist, `null` will be returned instead.

You can also pass the method an options object similar to the [find](#retrieving-a-list-of-records) method to expand relations or specify what fields to select.

### Create Record

To create a new record of an entity, use the `create` and `save` methods of the repository:

```ts
const post = postRepository.create()
post.title = data.title
post.author_id = data.author_id
const result = await postRepository.save(post)
```

The `save` method is what actually persists the created record in the database.

### Update Record

To update a record of an entity, use the `save` method of the repository:

```ts
// const data = {
//   title: ''
// }

// const post = await postRepository.findOne({
//   where: {
//     id: '1'
//   }
// })

Object.assign(post, data)

const updatedPost = await postRepository.save(post)
```

### Delete a Record

To delete a record of an entity, use the `remove` method of the repository:

```ts
const post = await postRepository.findOne({
  where: {
    id: "1",
  },
})

await postRepository.remove([post])
```

This method accepts an array of records to delete.

### Soft Delete a Record

If an entity extends the `SoftDeletableEntity` class, it can be soft deleted. This means that the entity won't be fully deleted from the database, but it can't be retrieved as a non-deleted entity would.

To soft-delete a record of an entity, use the `softRemove` method:

```ts
const post = await postRepository.findOne({
  where: {
    id: "1",
  },
})

await postRepository.softRemove([post])
```

You can later retrieve that entity by passing the `withDeleted` option to methods like `find`, `findAndCount`, or `findOne`:

```ts
const posts = await postRepository.find({
  withDeleted: true,
})
```
