---
title: 'How to Create an Admin Setting Page'
description: 'Learn how to create a new setting page in the admin dashboard.'
addHowToData: true
---

In this document, you’ll learn how to create a setting page in the admin.

## Overview

The [admin UI routes](./routes.md) allow you to add new pages to the admin dashboard. However, they can’t be used to add a new tab under the Setting page.

To do that, you need to create an Admin setting page. The page will automatically be shown as a tab under the Setting page in the admin. The tab leads to the content of your custom page. 

A setting page is essentially a React Component created under the `src/admin/settings` directory.

This guide explains how to create a new setting page in the admin dashboard with some examples.

---

## Prerequisites

It’s assumed you already have a Medusa backend with the admin plugin installed before you move forward with this guide. If not, you can follow [this documentation page](../create-medusa-app.mdx) to install a Medusa project.

### (Optional) TypeScript Preparations

Since setting pages are React components, they should be written in `.tsx` or `.jsx` files. If you’re using Typescript, you need to make some adjustments to avoid Typescript errors in your Admin files.

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

## Create the Setting Page

In this section, you’ll learn the basics of creating an admin UI route.

### Step 1: Create File

Custom admin setting pages are added under the `src/admin/settings` directory of your Medusa project. The path of the file depends on the path you want the setting page to be available under. It is based on [Next.js 13’s App Router](https://nextjs.org/docs/app/building-your-application/routing/defining-routes).

All setting page paths are prefixed with `/a/settings`.

For example, if you want the setting page to be available in the admin dashboard under the path `/a/settings/custom` you should create your setting page under the file path `src/admin/settings/custom/page.tsx`.

:::note

Only one-level deep files are accepted. So, for example, you can create the page `src/admin/settings/custom/page.tsx`, but not `src/admin/settings/custom/nested/page.tsx`.

:::

### Step 2: Create React Component in File

For a setting page to be valid, it must default export a React component. There are no restrictions on the content of the React component. It must also export a configuration object that indicates how the tab is shown on the Setting page.

For example, you can create the file `src/admin/settings/custom/page.tsx` with the following content:

```tsx title="src/admin/settings/custom/page.tsx"
import type { SettingConfig } from "@medusajs/admin"
import { CustomIcon } from "../../icons/custom"

const CustomSettingPage = () => {
  return (
    <div>
      <h1>Custom Setting Page</h1>
    </div>
  )
}

export const config: SettingConfig = {
  card: {
    label: "Custom",
    description: "Manage your custom settings",
    // optional
    icon: CustomIcon,
  },
}

export default CustomSettingPage
```

This creates a setting page that will be available at `/a/settings/custom`. The content of the page is defined in the exported React component.

The exported configuration also indicates the details of the tab that will be added to the Setting page. You must specify a label and description, and you can optionally specify an icon. The icon is a React component.

### Step 3: Test it Out

To test your admin setting page, run the following command in the root directory of the Medusa backend project:

```bash
npx medusa develop
```

This will build your admin and opens a window in your default browser to `localhost:7001`. After you log in, go to `localhost:7001/a/settings`. You’ll find a new tab available under a new Extensions section.

If you click on the tab, a new page will open with the content as defined in your React component.

---

## Setting Page Props

Every route receives props of the type `RouteProps`, which includes the `notify` prop. The `notify` prop is an object that includes the following attributes:

- `success`: a function that can be used to show a success message.
- `error`: a function that can be used to show an error message.
- `warn`: a function that can be used to show a warning message.
- `info`: a function that can be used to show an info message.

For example:

```tsx title="src/admin/settings/custom/page.tsx"
import type { SettingConfig } from "@medusajs/admin"
import type { SettingProps } from "@medusajs/admin"

const CustomSettingPage = ({
  notify,
}: SettingProps) => {

  const handleClick = () => {
    notify.success("Success", "You clicked the button")
  }

  return (
    <div>
      <h1>Custom Setting Page</h1>
      <button onClick={handleClick}>
        Click Me
      </button>
    </div>
  )
}

export const config: SettingConfig = {
  card: {
    label: "Custom",
    description: "Manage your custom settings",
  },
}

export default CustomSettingPage
```

---

## Styling Setting Page

Admin setting pages support [Tailwind CSS](https://tailwindcss.com/) by default.

For example, to customize the style of your custom setting page:

<!-- eslint-disable max-len -->

```tsx title="src/admin/settings/custom/page.tsx"
import type { SettingConfig } from "@medusajs/admin"

const CustomSettingPage = () => {
  return (
    <div
      className="bg-white p-8 border border-gray-200 rounded-lg"
    >
      <h1>Custom Setting Page</h1>
    </div>
  )
}

export const config: SettingConfig = {
  card: {
    label: "Custom",
    description: "Manage your custom settings",
  },
}

export default CustomSettingPage
```

---

## Use Routing Functionalities

If you want to use routing functionalities such as linking to another page or navigating between pages, you can use `react-router-dom`'s utility hooks and functions.

:::note

💡 `react-router-dom` is available as one of the `@medusajs/admin` dependencies. You can also install it within your project using the following command:

```bash npm2yarn
npm install react-router-dom
```

If you're installing it in a plugin with admin customizations, make sure to include it in `peerDependencies`.

:::

For example, to add a link to another page:

```tsx title="src/admin/settings/custom/page.tsx"
import type { SettingConfig } from "@medusajs/admin"
import { Link } from "react-router-dom"

const CustomSettingPage = () => {
  return (
    <div>
      <h1>Custom Setting Page</h1>
      <Link to={"/a/products"}>
        View Products
      </Link>
    </div>
  )
}

export const config: SettingConfig = {
  card: {
    label: "Custom",
    description: "Manage your custom settings",
  },
}

export default CustomSettingPage
```

View [react-router-dom’s documentation](https://reactrouter.com/en/main) for other available components and hooks.

---

## Querying and Mutating Data

You might need to interact with the Medusa backend from your admin setting page. To do so, you can utilize the Medusa React package. It contains a collection of queries and mutations built on `@tanstack/react-query@4.22` that lets you interact with the Medusa backend.

:::note

Make sure to also install the Medusa React package first if you’re intending to use it, as explained in the Medusa React guide.

:::

For example, you can retrieve available products and display them in your route:

```tsx title="src/admin/settings/custom/page.tsx"
import type { SettingConfig } from "@medusajs/admin"
import { useAdminProducts } from "medusa-react"

const CustomSettingPage = () => {
  const { products } = useAdminProducts()

  return (
    <div>
      <h1>Custom Setting Page</h1>
      <div className="bg-white">
        {products?.map((product) => product.title)}
      </div>
    </div>
  )
}

export const config: SettingConfig = {
  card: {
    label: "Custom",
    description: "Manage your custom settings",
  },
}

export default CustomSettingPage
```

### Custom API Routes

You can also use `medusa-react` to interact with custom API Routes using [Custom Hooks utility functions](../medusa-react/overview.mdx#custom-hooks).

---

## See Also

- [Admin widgets](./widgets.md)
- [Create a plugin for your admin customizations](../development/plugins/create.mdx)
