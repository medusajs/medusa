---
title: 'How to Create an Admin Widget'
description: 'Learn about what Admin widgets are and how you can create your own.'
addHowToData: true
---

In this document, you will learn about what Admin widgets are and how you can create your own.

## Overview

Admin Widgets are custom React components that developers create to be injected into predetermined injection zones across the Medusa Admin dashboard.

Widgets allow you to customize the admin dashboard by providing merchants with new features. For example, you can add a widget on the order details page that shows payment details retrieved from Stripe.

This guide explains the available injection zones and how to create an admin widget.

---

## Injection Zones

Injection zones are areas in the admin that you can add widgets into. Widgets can only be added into these areas.

There are different types of injection zones, and the type affects where the Widget is injected. For the different domains such as `product`, `order`, and `customer` there are `list` and `details` zones.

Below is a full list of injection zones:

:::note

You can learn more about the additional props in the Props section.

:::

<table class="reference-table">
<thead>
<tr>
<th>
Injection Zone Name
</th>
<th>
Description
</th>
<th>
Additional Props
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`order.list.before`

</td>
<td>

Added at the top of the orders list page

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`order.list.after`

</td>
<td>

Added at the bottom of the order list page

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`order.details.before`

</td>
<td>

Added at the top of the order details page

</td>
<td>

Type `OrderDetailsWidgetProps` imported from `@medusajs/admin`

<!-- eslint-skip -->

```ts noCopy noReport
{
  order, // Order object
}
```

</td>
</tr>

<tr>
<td>

`order.details.after`

</td>
<td>

Added at the end of the order details page

</td>
<td>

Type `OrderDetailsWidgetProps` imported from `@medusajs/admin`

<!-- eslint-skip -->

```ts noCopy noReport
{
  order, // Order object
}
```

</td>
</tr>

<tr>
<td>

`draft_order.list.before`

</td>
<td>

Added at the top of the draft orders list page

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`draft_order.list.after`

</td>
<td>

Added at the bottom of the draft orders list page

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`draft_order.details.before`

</td>
<td>

Added at the top of the draft order details page

</td>
<td>

Type `DraftOrderDetailsWidgetProps` imported from `@medusajs/admin`

<!-- eslint-skip -->

```ts noCopy noReport
{
  draftOrder, // DraftOrder object
}
```

</td>
</tr>

<tr>
<td>

`draft_order.details.after`

</td>
<td>

Added at the bottom of the draft order details page

</td>
<td>

Type `DraftOrderDetailsWidgetProps` imported from `@medusajs/admin`

<!-- eslint-skip -->

```ts noCopy noReport
{
  draftOrder, // DraftOrder object
}
```

</td>
</tr>

<tr>
<td>

`customer.list.before`

</td>
<td>

Added at the top of the customers list page

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`customer.list.after`

</td>
<td>

Added at the bottom of the customers list page

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`customer.details.before`

</td>
<td>

Added at the top of the customer details page

</td>
<td>

Type `CustomerDetailsWidgetProps` imported from `@medusajs/admin`

<!-- eslint-skip -->

```ts noCopy noReport
{
  customer, // Customer object
}
```

</td>
</tr>

<tr>
<td>

`customer.details.after`

</td>
<td>

Added at the bottom of the customer details page

</td>
<td>

Type `CustomerDetailsWidgetProps` imported from `@medusajs/admin`

<!-- eslint-skip -->

```ts noCopy noReport
{
  customer, // Customer object
}
```

</td>
</tr>

<tr>
<td>

`customer_group.list.before`

</td>
<td>

Added at the top of the customer groups list page

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`customer_group.list.after`

</td>
<td>

Added at the bottom of the customer groups list page

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`customer_group.details.before`

</td>
<td>

Added at the top of the customer group details page

</td>
<td>

Type `CustomerGroupDetailsWidgetProps` imported from `@medusajs/admin`

<!-- eslint-skip -->

```ts noCopy noReport
{
  customerGroup, // CustomerGroup object
}
```

</td>
</tr>

<tr>
<td>

`customer_group.details.after`

</td>
<td>

Added at the bottom of the customer group details page

</td>
<td>

Type `CustomerGroupDetailsWidgetProps` imported from `@medusajs/admin`

<!-- eslint-skip -->

```ts noCopy noReport
{
  customerGroup, // CustomerGroup object
}
```

</td>
</tr>

<tr>
<td>

`product.list.before`

</td>
<td>

Added at the top of the product list page

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`product.list.after`

</td>
<td>

Added at the bottom of the products list page

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`product.details.before`

</td>
<td>

Added at the top of the product details page

</td>
<td>

Type `ProductDetailsWidgetProps` imported from `@medusajs/admin`

<!-- eslint-skip -->

```ts noCopy noReport
{
  product, // Product object
}
```

</td>
</tr>

<tr>
<td>

`product.details.after`

</td>
<td>

Added at the bottom of the product details page

</td>
<td>

Type `ProductDetailsWidgetProps` imported from `@medusajs/admin`

<!-- eslint-skip -->

```ts noCopy noReport
{
  product, // Product object
}
```

</td>
</tr>

<tr>
<td>

`product_collection.list.before`

</td>
<td>

Added at the top of the product collections list page

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`product_collection.list.after`

</td>
<td>

Added at the bottom of the product collections list page

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`product_collection.details.before`

</td>
<td>

Added at the top of the product collection details page

</td>
<td>

Type `ProductCollectionDetailsWidgetProps` imported from `@medusajs/admin`.

<!-- eslint-skip -->

```ts noCopy noReport
{
  productCollection, // Collection object
}
```

</td>
</tr>

<tr>
<td>

`product_collection.details.after`

</td>
<td>

Added at the bottom of the product collections list page

</td>
<td>

Type `ProductCollectionDetailsWidgetProps` imported from `@medusajs/admin`.

<!-- eslint-skip -->

```ts noCopy noReport
{
  productCollection, // Collection object
}
```

</td>
</tr>

<tr>
<td>

`price_list.list.before`

</td>
<td>

Added at the top of the “price list” list page

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`price_list.list.after`

</td>
<td>

Added at the bottom of the “price list” list page

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`price_list.details.before`

</td>
<td>

Added at the top of the “price list” details page

</td>
<td>

Type `PriceListDetailsWidgetProps` imported from `@medusajs/admin`

<!-- eslint-skip -->

```ts noCopy noReport
{
  priceList, // PriceList object
}
```

</td>
</tr>

<tr>
<td>

`price_list.details.after`

</td>
<td>

Added at the bottom of the “price list” details page

</td>
<td>

Type `PriceListDetailsWidgetProps` imported from `@medusajs/admin`

<!-- eslint-skip -->

```ts noCopy noReport
{
  priceList, // PriceList object
}
```

</td>
</tr>

<tr>
<td>

`discount.list.before`

</td>
<td>

Added at the top of the discounts list page

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`discount.list.after`

</td>
<td>

Added at the bottom of the discounts list page

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`discount.details.before`

</td>
<td>

Added at the top of the discounts details page

</td>
<td>

Type `DiscountDetailsWidgetProps` imported from `@medusajs/admin`

<!-- eslint-skip -->

```ts noCopy noReport
{
  discount, // Discount object
}
```

</td>
</tr>

<tr>
<td>

`discount.details.after`

</td>
<td>

Added at the bottom of the discount details page

</td>
<td>

Type `DiscountDetailsWidgetProps` imported from `@medusajs/admin`

<!-- eslint-skip -->

```ts noCopy noReport
{
  discount, // Discount object
}
```

</td>
</tr>

<tr>
<td>

`gift_card.list.before`

</td>
<td>

Added at the top of the gift cards list page

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`gift_card.list.after`

</td>
<td>

Added at the bottom of the gift cards list page

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`gift_card.details.before`

</td>
<td>

Added at the top of the gift card details page

</td>
<td>

Type `GiftCardDetailsWidgetProps` imported from `@medusajs/admin`

<!-- eslint-skip -->

```ts noCopy noReport
{
  giftCard, // Product object
}
```

</td>
</tr>

<tr>
<td>

`gift_card.details.after`

</td>
<td>

Added at the bottom of the gift card details page

</td>
<td>

Type `GiftCardDetailsWidgetProps` imported from `@medusajs/admin`

<!-- eslint-skip -->

```ts noCopy noReport
{
  giftCard, // Product object
}
```

</td>
</tr>

<tr>
<td>

`custom_gift_card.before`

</td>
<td>

Added at the top of the custom gift card page

</td>
<td>

Type `GiftCardCustomWidgetProps` imported from `@medusajs/admin`

<!-- eslint-skip -->

```ts noCopy noReport
{
  giftCard, // GiftCard object
}
```

</td>
</tr>

<tr>
<td>

`custom_gift_card.after`

</td>
<td>

Added at the bottom of the custom gift card page

</td>
<td>

Type `GiftCardCustomWidgetProps` imported from `@medusajs/admin`

<!-- eslint-skip -->

```ts noCopy noReport
{
  giftCard, // GiftCard object
}
```

</td>
</tr>

<tr>
<td>

`login.before`

</td>
<td>

Added before the login form

</td>
<td>

\-

</td>
</tr>

<tr>
<td>

`login.after`

</td>
<td>

Added after the login form

</td>
<td>

\-

</td>
</tr>

</tbody>
</table>

---

## Widget Requirements

A Widget must adhere to a set of criteria that determines if it is valid for injection. These are:

1. All widget files must be placed in the folder `/src/admin/widgets` in your backend directory.
2. A widget file must have a valid React component as its default export.
3. A widget file must export a config object of type `WidgetConfig` imported from `@medusajs/admin`.

### WidgetConfig

`WidgetConfig` is used to determine the configurations of the widget, mainly the injection zones. It’s an object that accepts the property `zone`, which can be a single or an array of injection zone strings. For example:

```ts
{
  zone: "product.details.after"
}
```

---

## How to Create a Widget

In this section, you’ll learn how to create an admin widget.

### Prerequisites

It’s assumed you already have a Medusa backend with the admin plugin installed before you move forward with this guide. If not, you can follow [this documentation page](../create-medusa-app.mdx) to install a Medusa project.

### (Optional) TypeScript Preparations

Since Widgets are React components, they should be written in `.tsx` or `.jsx` files. If you’re using Typescript, you need to make some adjustments to avoid Typescript errors in your Admin files.

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

### (Optional) Update Scripts in package.json

You can optionally update the following scripts in `package.json` to make your development process easier:

```json title="package.json"
{
  // ...
  "scripts": {
    "clean": "cross-env ./node_modules/.bin/rimraf dist",
    "build": "cross-env npm run clean && npm run build:server && npm run build:admin",
    "build:server": "cross-env npm run clean && tsc -p tsconfig.server.json",
    "build:admin": "cross-env medusa-admin build",
    "watch": "cross-env tsc --watch",
    "test": "cross-env jest",
    "seed": "cross-env medusa seed -f ./data/seed.json",
    "start": "cross-env npm run build && medusa start",
    "start:custom": "cross-env npm run build && node --preserve-symlinks index.js",
    "dev": "cross-env npm run build:server && medusa develop"
  },
  // ...
}
```

:::note

If you have `autoRebuild` enabled in the options of `@medusajs/admin`, you shouldn’t include `npm run build:admin` in the `build` script. It will lead to the admin being built twice during development.

:::

### Create the Admin Widget

To create a new admin widget, start by creating the folder `src/admin/widgets`. This is where your widgets must be located, as explained in the Widgets Requirements section.

Then, create the file `src/admin/widgets/product-widget.tsx` with the following content:

```tsx title="src/admin/widgets/product-widget.tsx"
import type { WidgetConfig } from "@medusajs/admin"

const ProductWidget = () => {
  return (
    <div>
      <h1>Product Widget</h1>
    </div>
  )
}

export const config: WidgetConfig = {
  zone: "product.details.after",
}

export default ProductWidget
```

This file creates a React Component `ProductWidget` which renders an H1 header. This React Component is the default export in the file, which is one of the Widgets Requirements.

You also export the object `config` of type `WidgetConfig`, which is another widget requirement. It indicates that the widget must be injected in the `product.details.after` zone.

To test out your widget, run the following command in the root backend directory:

```bash
npx medusa develop
```

This command will build your backend and admin, then runs the backend.

Open `localhost:7001` in your browser and log in. Then, go to the details page of any product. You should now see your widget at the bottom of the page.

Try making any changes to the component. The development server will hot-reload and your widget will be updated immediately.

### Widget Props

Every widget receives props of the type `WidgetProps`, which includes the `notify` prop. The `notify` prop is an object that includes the following attributes:

- `success`: a function that can be used to show a success message.
- `error`: a function that can be used to show an error message.
- `warn`: a function that can be used to show a warning message.
- `info`: a function that can be used to show an info message.

In addition, some injection zones provide additional props specific to the context of the page. For example, widgets in the `product.details.after` zone will also receive a `product` prop, which is an object holding the data of the product being viewed.

You can learn about what additional props each injection zone may receive in the Injection Zone section.

For example, you can modify the widget you created to show the title of the product:

<!-- eslint-disable max-len -->

```tsx title="src/admin/widgets/product-widget.tsx"
import type { 
  WidgetConfig, 
  ProductDetailsWidgetProps,
} from "@medusajs/admin"

const ProductWidget = ({
  product,
  notify,
}: ProductDetailsWidgetProps) => {
  return (
    <div className="bg-white p-8 border border-gray-200 rounded-lg">
      <h1>Product Widget {product.title}</h1>
      <button 
        className="bg-black rounded p-1 text-white"
        onClick={() => notify.success("success", "You clicked the button!")}
      >
        Click me
      </button>
    </div>
  )
}

export const config: WidgetConfig = {
  zone: "product.details.after",
}

export default ProductWidget
```

---

## Styling your Widget

Admin Widgets support [Tailwind CSS](https://tailwindcss.com/) out of the box.

For example, you can update the widget you created earlier to use Tailwind CSS classes:

<!-- eslint-disable max-len -->

```tsx title="src/admin/widgets/product-widget.tsx"
import type { 
  WidgetConfig,
} from "@medusajs/admin"

const ProductWidget = () => {
  return (
    <div 
      className="bg-white p-8 border border-gray-200 rounded-lg">
      <h1>Product Widget</h1>
    </div>
  )
}

export const config: WidgetConfig = {
  zone: "product.details.after",
}

export default ProductWidget
```

---

## Routing Functionalities

If you want to navigate to other pages, link to other pages, or use other routing functionalities, you can use [react-router-dom](https://reactrouter.com/en/main) package.

:::note

`react-router-dom` is available as one of the `@medusajs/admin` dependencies. You can also install it within your project using the following command:

```bash npm2yarn
npm install react-router-dom
```

If you're installing it in a plugin with admin customizations, make sure to include it in `peerDependencies`.

:::

For example:

<!-- eslint-disable max-len -->

```tsx title="src/admin/widgets/product-widget.tsx"
import type { WidgetConfig } from "@medusajs/admin"
import { Link } from "react-router-dom"

const ProductWidget = () => {
  return (
    <div
      className="bg-white p-8 border border-gray-200 rounded-lg">
      <h1>Product Widget</h1>
      <Link to={"/a/orders"}>
        View Orders
      </Link>
    </div>
  )
}

export const config: WidgetConfig = {
  zone: "product.details.after",
}

export default ProductWidget
```

View [react-router-dom’s documentation](https://reactrouter.com/en/main) for other available components and hooks.

---

## Querying and Mutating Data

You will most likely need to interact with the Medusa backend  from your Widgets. To do so, you can utilize the Medusa React package. It contains a collection of queries and mutation built on `@tanstack/react-query` that lets you interact with the Medusa backend.

:::note

Make sure to also install the Medusa React package first if you’re intending to use it, as explained in the [Medusa React guide](../medusa-react/overview.mdx).

:::

For example, you can modify the widget you created to retrieve the tags of a product from the Medusa backend:

<!-- eslint-disable max-len -->

```tsx title="src/admin/widgets/product-widget.tsx"
import type { ProductDetailsWidgetProps, WidgetConfig } from "@medusajs/admin"
import { useAdminProductTags } from "medusa-react"

const ProductWidget = ({ product }: ProductDetailsWidgetProps) => {
  const { product_tags } = useAdminProductTags({
    id: product.tags.map((tag) => tag.id),
    limit: 10,
    offset: 0,
  })

  return (
    <div className="bg-white p-8 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Product Tags</h3>
      <div className="flex flex-wrap">
        {product_tags?.map((tag) => (
          <span
            key={tag.id}
            className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs mr-2 mb-2"
          >
            {tag.value}
          </span>
        ))}
      </div>
    </div>
  )
}

export const config: WidgetConfig = {
  zone: "product.details.after",
}

export default ProductWidget
```

### Custom API Routes

You can also use `medusa-react` to interact with custom API Routes using the [createCustomAdminHooks utility function](../medusa-react/overview.mdx#custom-hooks).

---

## See Also

- [How to create admin UI routes](./routes.md)
- [Create a plugin for your admin customizations](../development/plugins/create.mdx)
