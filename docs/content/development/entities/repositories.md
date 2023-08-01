---
description: "In this document, you'll learn what repositories are, how to use them within your Medusa backend, and what are some of their common methods."
---

# Repositories

In this document, you'll learn what repositories are, how to use them within your Medusa backend, and what are some of their common methods.

## Overview

Repositories provide generic helper methods for entities. For example, a `find` method to retrieve all entities with pagination, or `findOne` to retrieve a single entity record.

Repostories are [Typeorm repositories](https://typeorm.io/working-with-repository), so you can refer to Typeorm's documentation on all available methods.

This guide provides some basic methods you'll need during your custom development with Medusa.

---

## Basic Implementation

Each entity you create needs a repository. A repository is created under the `src/repositories` directory of your Medusa backend project. The file name is the name of the repository without `Repository`.

For example, to create a repository for a `Post` entity, create the file `src/repositories/post.ts` with the following content:

```ts src=src/repositories/post.ts
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

---

## Customizing a Repository

If you want to add methods to the repository or override Typeorm's Repository methods, you can do that using the `extend` method:

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

## Using Repositories in Other Resources

When you want to perform an action or use on an entity in one of your custom resources, such as an endpoint or a service, you need to use its repository.

### Endpoints

To access a repository within an endpoint, use the `req.scope.resolve` method. For example:

```ts
import { PostRepository } from "../repositories/post"
import { EntityManager } from "typeorm"

// ...

export default () => {
  // ...

  storeRouter.get("/posts", async (req, res) => {
    const postRepository: typeof PostRepository = 
      req.scope.resolve("postRepository")
    const manager: EntityManager = req.scope.resolve("manager")
    const postRepo = manager.withRepository(postRepository)

    return res.json({
      posts: await postRepo.find(),
    })
  })

  // ...
}
```

You can learn more about endpoints [here](../endpoints/overview.mdx).

### Services and Subscribers

As repositories are registered in the [dependency container](../fundamentals/dependency-injection.md#dependency-container-and-injection), they can be accessed through dependency injection in the constructor of a service or a subscriber.

For example:

```ts title=/src/services/post.ts
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

You can also filter the retrieved items by passing an object of type [FindOption](https://typeorm.io/find-options) as a first parameter:

```ts
const posts = await postRepository.find({
  where: {
    id: "1",
  },
})
```

In addition, you can pass `skip` and `take` properties to the object for pagination purposes. `skip`'s value is a number that indicates how many items to skip before retrieving the results, and `take` indicates how many items to return:

```ts
const posts = await postRepository.find({
  skip: 0,
  take: 20,
})
```

To expand relations and retrieve them as part of each item in the result, you can pass the `relations` property to the parameter object:

```ts
const posts = await postRepository.find({
  relations: ["authors"],
})
```

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