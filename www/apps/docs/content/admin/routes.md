---
title: 'How to Create an Admin UI Route'
description: 'Learn how to create a new route in the admin dashboard.'
addHowToData: true
---

In this document, you’ll learn how to create a new route in the admin dashboard.

## Overview

You can customize the admin dashboard that Medusa provides to add new routes. This is useful if you want to add new subpages to the admin dashboard, or you want to add new pages that appear in the sidebar as well.

An admin UI route is essentially a React Component created under the `src/admin/routes` directory.

This guide explains how to create a new route in the admin dashboard with some examples.

:::note

If you want to create a page under the Settings page, please refer to [this documentation](./setting-pages.md) instead.

:::

---

## Prerequisites

It’s assumed you already have a Medusa backend with the admin plugin installed before you move forward with this guide. If not, you can follow [this documentation page](../create-medusa-app.mdx) to install a Medusa project.

### (Optional) TypeScript Preparations

Since routes are React components, they should be written in `.tsx` or `.jsx` files. If you’re using Typescript, you need to make some adjustments to avoid Typescript errors in your Admin files.

This section provides recommended configurations to avoid any TypeScript errors.

:::note

These changes may already be available in your Medusa project. They're included here for reference purposes.

:::

First, update your `tsconfig.json` with the following configurations:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "target": "es2019",
    "module": "commonjs",
    "allowJs": true, 
    "checkJs": false, 
    "jsx": "react-jsx", 
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "noEmit": false,
    "strict": false,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/"],
  "exclude": [
    "dist",
    "build",
    ".cache",
    "tests",
    "**/*.spec.js",
    "**/*.spec.ts",
    "node_modules",
    ".eslintrc.js"
  ]
}
```

The important changes to note here are the inclusion of the field `"jsx": "react-jsx"` and the addition of `"build"` and `“.cache”` to `exclude`.

The addition of `"jsx": "react-jsx"` specified how should TypeScript transform JSX, and excluding `build` and `.cache` ensures that TypeScript ignores build and development files.

Next, create the file `tsconfig.server.json` with the following content:

```json title="tsconfig.server.json"
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    /* Emit a single file with source maps instead of having a separate file. */
    "inlineSourceMap": true
  },
  "exclude": ["src/admin", "**/*.spec.js"]
}
```

This is the configuration that will be used to transpile your custom backend code, such as services or entities. The important part is that it excludes `src/admin` as that is where your Admin code will live.

Finally, create the file `tsconfig.admin.json` with the following content:

```json title="tsconfig.admin.json"
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "esnext"
  },
  "include": ["src/admin"],
  "exclude": ["**/*.spec.js"]
}
```

This is the configuration that will be used when transpiling your admin code.

---

## Create the Admin UI Route

In this section, you’ll learn the basics of creating an admin UI route.

### Step 1: Create File

Custom admin UI routes are added under the `src/admin/routes` directory of your Medusa project. The path of the file depends on the path you want the route to be available under. It is based on [Next.js 13’s App Router](https://nextjs.org/docs/app/building-your-application/routing/defining-routes).

For example, if you want the route to be available in the admin dashboard under the path `/a/custom` you should create your admin route under the path `src/admin/routes/custom/page.tsx`.

:::tip

All admin routes are prefixed with `/a` by default.

:::

You can also create [dynamic routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes). For example, you can create the route `/a/custom/[id]` by creating an admin router under the path `src/admin/routes/custom/[id]/page.tsx`.

### Step 2: Create React Component in File

For an admin route to be valid, it must default export a React component. There are no restrictions on the content of the React component.

For example, you can create the file `src/admin/routes/custom/page.tsx` with the following content:

```tsx title="src/admin/routes/custom/page.tsx"
const CustomPage = () => {
  return (
    <div>
      This is my custom route
    </div>
  )
}

export default CustomPage
```

This will create an admin UI route at the path `/a/custom`, with its content being the content of the React component.

### Step 3: Test it Out

To test your admin UI route, run the following command in the root directory of the Medusa backend project:

```bash npm2yarn
npx medusa develop
```

This will build your admin and opens a window in your default browser to `localhost:7001`. After you log in, if you go to `localhost:7001/a/custom`, you’ll find the page you just created.

:::note

When using the `develop` command, the admin dashboard will run in development mode and will restart whenever you make changes to your admin customizations. This allows you to see changes in the dashboard instantly during your development.

:::

---

## Route Props

Every route receives props of the type `RouteProps`, which includes the `notify` prop. The `notify` prop is an object that includes the following attributes:

- `success`: a function that can be used to show a success message.
- `error`: a function that can be used to show an error message.
- `warn`: a function that can be used to show a warning message.
- `info`: a function that can be used to show an info message.

For example:

```tsx
import { Post } from "../../../../../models/post"
import PostForm from "../../../../components/post/form"
import { RouteProps } from "@medusajs/admin"

const BlogPostCreatePage = ({
  notify,
}: RouteProps) => {
  const onSuccess = (post: Post) => {
    notify.success(
      "Success",
      `Post ${post.title} created successfully`
    )
  }

  return (
    <div>
      <h1 className="text-xl mb-2">Create Post</h1>
      <PostForm onSuccess={onSuccess} />
    </div>
  )
}

export default BlogPostCreatePage
```

---

## Show Route in Sidebar

You can add your routes into the admin dashboard sidebar by exporting an object of type `RouteConfig` import from `@medusajs/admin` in the same route file.

The object has one property `link`, which is an object having the following properties:

- `label`: a string indicating the sidebar item’s label of your custom route.
- `icon`: an optional React component that acts as an icon in the sidebar. If none provided, a default icon is used.

For example, you can change the content of the previous route you created to export a config object:

```tsx title="src/admin/routes/custom/page.tsx"
import { RouteConfig } from "@medusajs/admin"
import { CustomIcon } from "../../icons/custom"

const CustomPage = () => {
  return (
    <div>
      This is my custom route
    </div>
  )
}

export const config: RouteConfig = {
  link: {
    label: "Custom Route",
    icon: CustomIcon,
  },
}

export default CustomPage
```

---

## Retrieve Path Parameters

As mentioned earlier, you can create dynamic routes like `/a/custom/[id]` by creating a route file at the path `src/admin/routes/custom/[id]/page.tsx`.

To retrieve the path parameter, you can use the [useParams hook](https://reactrouter.com/en/main/hooks/use-params) retrieved from the [react-router-dom](https://reactrouter.com/en/main) package.

:::note

`react-router-dom` is available as one of the `@medusajs/admin` dependencies. You can also install it within your project using the following command:

```bash npm2yarn
npm install react-router-dom
```

If you're installing it in a plugin with admin customizations, make sure to include it in `peerDependencies`.

:::

For example:

```tsx title="src/admin/routes/custom/[id]/page.tsx"
import { useParams } from "react-router-dom"

const CustomPage = () => {
  const { id } = useParams()

  return (
    <div>
      Passed ID: {id}
    </div>
  )
}

export default CustomPage
```

---

## Routing Functionalities

If you want to use routing functionalities such as linking to another page or navigating between pages, you can use `react-router-dom`'s utility hooks and functions.

For example, to add a link to another page:

```tsx title="src/admin/routes/custom/page.tsx"
import { Link } from "react-router-dom"

const CustomPage = () => {

  return (
    <div>
      <Link to={"/a/products"}>
        View Products
      </Link>
    </div>
  )
}

export default CustomPage
```

View [react-router-dom’s documentation](https://reactrouter.com/en/main) for other available components and hooks.

---

## Styling Route

Admin UI routes support [Tailwind CSS](https://tailwindcss.com/) by default.

For example, to customize your custom route:

<!-- eslint-disable max-len -->

```tsx title="src/admin/routes/custom/page.tsx"
const CustomPage = () => {
  return (
    <div 
      className="bg-white p-8 border border-gray-200 rounded-lg">
      This is my custom route
    </div>
  )
}

export default CustomPage
```

---

## Querying and Mutating Data

You might need to interact with the Medusa backend from your admin route. To do so, you can utilize the [Medusa React package](../medusa-react/overview.mdx). It contains a collection of queries and mutation built on `@tanstack/react-query@4.22` that lets you interact with the Medusa backend.

:::note

Make sure to also install the Medusa React package first if you’re intending to use it, as explained in the [Medusa React guide](../medusa-react/overview.mdx).

:::

For example, you can retrieve available products and display them in your route:

```tsx title="src/admin/routes/custom/page.tsx"
import { useAdminProducts } from "medusa-react"

const CustomPage = () => {
  const { products } = useAdminProducts()
  return (
    <div className="bg-white">
      {products?.map((product) => product.title)}
    </div>
  )
}

export default CustomPage
```

### Custom API Routes

You can also use `medusa-react` to interact with custom API Routes using [Custom Hooks utility functions](../medusa-react/overview.mdx#custom-hooks).

---

## See Also

- [Admin widgets](./widgets.md)
- [Create a plugin for your admin customizations](../development/plugins/create.mdx)
