# Custom Module

A module is a package of reusable functionalities. It can be integrated into your Medusa application without affecting the overall system. You can create a module as part of a plugin.

> Learn more about modules in [this documentation](https://docs.medusajs.com/learn/fundamentals/modules).

To create a module:

## 1. Create a Data Model

A data model represents a table in the database. You create a data model in a TypeScript or JavaScript file under the `models` directory of a module.

For example, create the file `src/modules/blog/models/post.ts` with the following content:

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  id: model.id().primaryKey(),
  title: model.text(),
})

export default Post
```

## 2. Create a Service

A module must define a service. A service is a TypeScript or JavaScript class holding methods related to a business logic or commerce functionality.

For example, create the file `src/modules/blog/service.ts` with the following content:

```ts
import { MedusaService } from "@medusajs/framework/utils"
import Post from "./models/post"

class BlogModuleService extends MedusaService({
  Post,
}){
}

export default BlogModuleService
```

## 3. Export Module Definition

A module must have an `index.ts` file in its root directory that exports its definition. The definition specifies the main service of the module.

For example, create the file `src/modules/blog/index.ts` with the following content:

```ts
import BlogModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const BLOG_MODULE = "blog"

export default Module(BLOG_MODULE, {
  service: BlogModuleService,
})
```

## 4. Add Module to Medusa's Configurations

To start using the module, add it to `medusa-config.ts`:

```ts
module.exports = defineConfig({
  projectConfig: {
    // ...
  },
  modules: [
    {
      resolve: "./src/modules/blog",
    },
  ],
})
```

## 5. Generate and Run Migrations

To generate migrations for your module, run the following command:

```bash
npx medusa db:generate blog
```

Then, to run migrations, run the following command:

```bash
npx medusa db:migrate
```

## Use Module

You can use the module in customizations within the Medusa application, such as workflows and API routes.

For example, to use the module in an API route:

```ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import BlogModuleService from "../../../modules/blog/service"
import { BLOG_MODULE } from "../../../modules/blog"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogModuleService: BlogModuleService = req.scope.resolve(
    BLOG_MODULE
  )

  const posts = await blogModuleService.listPosts()

  res.json({
    posts
  })
}
```
