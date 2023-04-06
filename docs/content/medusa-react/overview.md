---
description: 'Learn how to install Medusa React in a React storefront. Medusa React is a React library that provides a set of utilities and hooks for interactive with the Medusa backend.'
---

# Medusa React

[Medusa React](https://www.npmjs.com/package/medusa-react) is a React library that provides a set of utilities and hooks for interacting seamlessly with the Medusa backend. It can be used to build custom React-based storefronts or admin dashboards.

:::tip

Alternatively, you can use Medusa’s [JS Client](../js-client/overview.md) or the [REST APIs](/api/store).

:::

## Installation

In the directory holding your React-based storefront or admin dashboard, run the following command to install Medusa React:

```bash npm2yarn
npm install medusa-react @tanstack/react-query @medusajs/medusa
```

In addition to the `medusa-react` library, you need the following libraries:

1\. `@tanstack/react-query`: `medusa-react` is built on top of [Tanstack Query](https://tanstack.com/query/latest/docs/react/overview). You’ll learn later in this reference how you can use Mutations and Queries with Medusa React.

:::note

Versions of Medusa React prior to v4.0.2 used React Query v3 instead of Tanstack Query. Check out [this upgrade guide] to learn how you can update your storefront.

:::

2\. `@medusajs/medusa`: The core Medusa package. This is used to import types used by Medusa React and while developing with it.

:::info

Part of the Medusa roadmap is to move the types into a separate package, removing the need to install the core Medusa package in your storefront or admin dashboard. You can check other items on our roadmap in [GitHub Discussions](https://github.com/medusajs/medusa/discussions/categories/roadmap).

:::

---

## Usage

To use the hooks exposed by Medusa React, you need to include  the `MedusaProvider` somewhere up in your component tree.

The `MedusaProvider` requires two props:

1. `baseUrl`: The URL to your Medusa backend
2. `queryClientProviderProps`: An object used to set the Tanstack Query client. The object requires a `client` property, which should be an instance of [QueryClient](https://tanstack.com/query/v4/docs/react/reference/QueryClient).

For example:

```tsx title=src/App.ts
import { MedusaProvider } from "medusa-react"
import Storefront from "./Storefront"
import { QueryClient } from "@tanstack/react-query"
import React from "react"

const queryClient = new QueryClient()

const App = () => {
  return (
    <MedusaProvider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl="http://localhost:9000"
    >
      <Storefront />
    </MedusaProvider>
  )
}

export default App
```

In the example above, you wrap the `Storefront` component with the `MedusaProvider`. `Storefront` is assumed to be the top-level component of your storefront, but you can place `MedusaProvider` at any point in your tree. Only children of `MedusaProvider` can benefit from its hooks.

The `Storefront` component and its child components can now use hooks exposed by Medusa React.

### MedusaProvider Optional Props

You can also pass the following props to Medusa Provider:

| Props               | Default                   | Description                                               |
| ------------------- | ------------------------- | --------------------------------------------------------- |
| `apiKey`            | `''`                      | Optional API key used for authenticating admin requests.  |
| `publishableApiKey` | `''`                      | Optional publishable API key used for storefront requests.|

### Queries

To fetch data from the Medusa backend (in other words, perform `GET` requests), you can use [Queries](https://tanstack.com/query/v4/docs/react/guides/queries). Query hooks simply wrap around Tanstack Query's `useQuery` hook to fetch data from your medusa backend.

For example, to fetch products from your Medusa backend:

```tsx title=src/Products.ts
import { Product } from "@medusajs/medusa"
import { useProducts } from "medusa-react"

const Products = () => {
  const { products, isLoading } = useProducts()

  return isLoading ? (
    <div>
      Loading...
    </div>
  ) : (
    <ul>
      {products?.map((product: Product) => (
        <li key={product.id}>
          {product.title}
        </li>
      ))}
    </ul>
  )
}

export default Products
```

In the example above, you import the `useProducts` hook from `medusa-react`. This hook, and every other query hook exposed by `medusa-react`, returns everything that `useQuery` [returns in Tanstack Query](https://tanstack.com/query/v4/docs/react/reference/useQuery), except for the `data` field.

Instead of the `data` field, the response data is flattened and is part of the hooks’ returned fields. In the example above, the List Products endpoint returns a `products` array. So, `useProducts` returns a `products` array along with other fields returned by `useQuery`.

If the request accepts any parameters, they can be passed as parameters to the `mutate` request. For example:

```tsx title=src/Products.ts
const { products } = useProducts({
    expand: "variants",
  })
```

You can learn more about using queries in [Tanstack Query’s documentation](https://tanstack.com/query/v4/docs/react/guides/queries).

### Mutations

To create, update, or delete data on the Medusa backend (in other words, perform `POST`, `PUT`, and `DELETE` requests), you can use [Mutations](https://tanstack.com/query/v4/docs/react/guides/mutations). Mutation hooks wrap around Tanstack Query's `useMutation` to mutate data on your medusa backend.

For example, to create a cart:

```tsx title=src/Cart.ts
import { useCreateCart } from "medusa-react"

const Cart = () => {
  const createCart = useCreateCart()
  const handleClick = () => {
    createCart.mutate({}) // create an empty cart
  }

  return (
    <div>
      {createCart.isLoading && <div>Loading...</div>}
      {!createCart.data?.cart && (
        <button onClick={handleClick}>
          Create cart
        </button>
      )}
      {createCart.data?.cart?.id && (
        <div>Cart ID: {createCart.data?.cart.id}</div>
      )}
    </div>
  )
}

export default Cart
```

In the example above, you import the `useCreateCart` hook from `medusa-react`. This hook, and every other mutation hook exposed by `medusa-react`, returns everything that [useMutation](https://tanstack.com/query/v4/docs/react/reference/useMutation) returns. You can also pass the same options you would pass to `useMutation` to mutation hooks exposed by `medusa-react`.

To create a cart, you call the `createCart.mutate` method. In the underlying logic, this method sends a `POST` request to the Medusa backend to create a cart.

If the request accepts any parameters, they can be passed as parameters to the `mutate` request. For example:

```ts
createCart.mutate({
  region_id,
})
```

Once the cart is created, you can access it in the `data` field returned by the mutation hook. This field includes all data returned in the response.

:::note

The example above does not store in the browser the ID of the cart created, so the cart’s data will be gone on release. You would have to do that using the browser’s [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

:::

Instead of using `mutate`, you can use `mutateAsync` to receive a Promise that resolves on success or throws on error.

Learn more about how you can use mutations in [Tanstack Query’s documentation](https://tanstack.com/query/v4/docs/react/guides/mutations).

---

## Utilities

`medusa-react` exposes a set of utility functions that are mainly used to retrieve or format the price of a product variant.

### formatVariantPrice

This utility function can be used to compute the price of a variant for a region and retrieve the formatted amount. For example, `$20.00`.

It accepts an object with the following properties:

- `variant`: A variant object retrieved from the Medusa backend. It should mainly include the `prices` array in the object.
- `region`: A region object retrieved from the Medusa backend.
- `includeTaxes`: (optional) A boolean value that indicates whether the computed price should include taxes or not. The default value is `true`.
- `minimumFractionDigits`: (optional) The minimum number of fraction digits to use when formatting the price. This is passed as an option to `Intl.NumberFormat` in the underlying layer. You can learn more about this method’s options in [MDN’s documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#parameters).
- `maximumFractionDigits`: (optional) The maximum number of fraction digits to use when formatting the price. This is passed as an option to `Intl.NumberFormat` which is used within the utility method. You can learn more about this method’s options in [MDN’s documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#parameters).
- `locale`: (optional) A string with a BCP 47 language tag. The default value is `en-US`. This is passed as a first parameter to `Intl.NumberFormat` which is used within the utility method. You can learn more about this method’s parameters in [MDN’s documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#parameters).

For example:

```tsx title=src/Products.ts
import { formatVariantPrice } from "medusa-react"
import { Product, ProductVariant } from "@medusajs/medusa"

const Products = () => {
  // ...
  return (
    <ul>
      {products?.map((product: Product) => (
        <li key={product.id}>
          {product.title}
          <ul>
            {product.variants.map((variant: ProductVariant) => (
              <li key={variant.id}>
                {formatVariantPrice({
                  variant,
                  region, // should be retrieved earlier
                })}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
```

### computeVariantPrice

This utility function can be used to compute the price of a variant for a region and retrieve the amount without formatting. For example, `20`. This method is used by `formatVariantPrice` before applying the price formatting.

It accepts an object with the following properties:

- `variant`: A variant object retrieved from the Medusa backend. It should mainly include the `prices` array in the variant.
- `region`: A region object retrieved from the Medusa backend.
- `includeTaxes`: (optional) A boolean value that indicates whether the computed price should include taxes or not. The default value is `true`.

For example:

```tsx title=src/Products.ts
import { computeVariantPrice } from "medusa-react"
import { Product, ProductVariant } from "@medusajs/medusa"

const Products = () => {
  // ...
  return (
    <ul>
      {products?.map((product: Product) => (
        <li key={product.id}>
          {product.title}
          <ul>
            {product.variants.map((variant: ProductVariant) => (
              <li key={variant.id}>
                {computeVariantPrice({
                  variant,
                  region, // should be retrieved earlier
                })}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
```

### formatAmount

This utility function can be used to compute the price of an amount for a region and retrieve the formatted amount. For example, `$20.00`.

The main difference between this utility function and `formatVariantPrice` is that you don’t need to pass a complete variant object. This can be used with any number.

It accepts an object with the following properties:

- `amount`: A number that should be used for computation.
- `region`: A region object retrieved from the Medusa backend.
- `includeTaxes`: (optional) A boolean value that indicates whether the computed price should include taxes or not. The default value is `true`.
- `minimumFractionDigits`: (optional) The minimum number of fraction digits to use when formatting the price. This is passed as an option to `Intl.NumberFormat` in the underlying layer. You can learn more about this method’s options in [MDN’s documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#parameters).
- `maximumFractionDigits`: (optional) The maximum number of fraction digits to use when formatting the price. This is passed as an option to `Intl.NumberFormat` which is used within the utility method. You can learn more about this method’s options in [MDN’s documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#parameters).
- `locale`: (optional) A string with a BCP 47 language tag. The default value is `en-US`. This is passed as a first parameter to `Intl.NumberFormat` which is used within the utility method. You can learn more about this method’s parameters in [MDN’s documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#parameters).

For example:

```tsx title=src/MyComponent.ts
import { formatAmount } from "medusa-react"

const MyComponent = () => {
  // ...
  return (
    <div>
      {formatAmount({
        amount,
        region, // should be retrieved earlier
      })}
    </div>
  )
}
```

### computeAmount

This utility function can be used to compute the price of an amount for a region and retrieve the amount without formatting. For example, `20`. This method is used by `formatAmount` before applying the price formatting.

The main difference between this utility function and `computeVariantPrice` is that you don’t need to pass a complete variant object. This can be used with any number.

It accepts an object with the following properties:

- `amount`: A number that should be used for computation.
- `region`: A region object retrieved from the Medusa backend.
- `includeTaxes`: (optional) A boolean value that indicates whether the computed price should include taxes or not. The default value is `true`.

For example:

```tsx title=src/MyComponent.ts
import { computeAmount } from "medusa-react"

const MyComponent = () => {
  // ...
  return (
    <div>
      {computeAmount({
        amount,
        region, // should be retrieved earlier
      })}
    </div>
  )
}
```

---

## Content Providers

:::info

This is an experimental feature.

:::

To facilitate building custom storefronts, `medusa-react` also exposes a `CartProvider` and a `SessionCartProvider`.

### CartProvider

`CartProvider` makes use of some of the hooks already exposed by `medusa-react` to perform cart operations on the Medusa backend. You can use it to create a cart, start the checkout flow, authorize payment sessions, and so on.

It also manages one single global piece of state which represents a cart, exactly like the one created on your medusa backend.

To use `CartProvider`, you first have to insert it somewhere in your component tree below the `MedusaProvider`.

For example:

```tsx title=src/App.ts
import { CartProvider, MedusaProvider } from "medusa-react"
import Storefront from "./Storefront"
import { QueryClient } from "@tanstack/react-query"
import React from "react"

const queryClient = new QueryClient()

function App() {
  return (
    <MedusaProvider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl="http://localhost:9000"
    >
      <CartProvider>
        <Storefront />
      </CartProvider>
    </MedusaProvider>
  )
}

export default App
```

Then, in any of the child components, you can use the `useCart` hook exposed by `medusa-react` to get access to cart operations and data.

The `useCart` hook returns an object with the following properties:

- `cart`: A state variable holding the cart object. This is set if the `createCart` mutation is executed or if `setCart` is manually used.
- `setCart`: A state function used to set the cart object.
- `totalItems`: The number of items in the cart.
- `createCart`: A mutation used to create a cart.
- `updateCart`: A mutation used to update a cart’s details such as region, customer email, shipping address, and more.
- `startCheckout`: A mutation used to initialize payment sessions during checkout.
- `pay`: A mutation used to select a payment processor during checkout.
- `addShippingMethod`: A mutation used to add a shipping method to the cart during checkout.
- `completeCheckout`: A mutation used to complete the cart and place the order.

For example:

```tsx title=src/Cart.ts
import * as React from "react"

import { useCart } from "medusa-react"

const Cart = () => {
  const handleClick = () => {
    createCart.mutate({}) // create an empty cart
  }

  const { cart, createCart } = useCart()

  return (
    <div>
      {createCart.isLoading && <div>Loading...</div>}
      {!cart?.id && (
        <button onClick={handleClick}>
          Create cart
        </button>
      )}
      {cart?.id && (
        <div>Cart ID: {cart.id}</div>
      )}
    </div>
  )
}

export default Cart
```

In the example above, you retrieve the `createCart` mutation and `cart` state object using the `useCart` hook. If the `cart` is not set, a button is shown. When the button is clicked, the `createCart` mutation is executed, which interacts with the backend and creates a new cart.

After the cart is created, the `cart` state variable is set and its ID is shown instead of the button.

:::note

The example above does not store in the browser the ID of the cart created, so the cart’s data will be gone on release. You would have to do that using the browser’s [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

:::

### SessionProvider

Unlike the `CartProvider`, `SessionProvider` never interacts with the Medusa backend. It can be used to implement the user experience related to managing a cart’s items. Its state variables are JavaScript objects living in the browser, but are in no way communicated with the backend.

You can use the `SessionProvider` as a lightweight client-side cart functionality. It’s not stored in any database or on the Medusa backend.

To use `SessionProvider`, you first have to insert it somewhere in your component tree below the `MedusaProvider`.

For example:

```tsx title=src/App.ts
import { SessionProvider, MedusaProvider } from "medusa-react"
import Storefront from "./Storefront"
import { QueryClient } from "@tanstack/react-query"
import React from "react"

const queryClient = new QueryClient()

const App = () => {
  return (
    <MedusaProvider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl="http://localhost:9000"
    >
      <SessionProvider>
        <Storefront />
      </SessionProvider>
    </MedusaProvider>
  )
}

export default App
```

Then, in any of the child components, you can use the `useSessionHook` hook exposed by `medusa-react` to get access to client-side cart item functionalities.

For example:

```tsx title=src/Products.ts
const Products = () => {
  const { addItem } = useSessionCart()
  // ...

  function addToCart(variant: ProductVariant) {
    addItem({
      variant: variant,
      quantity: 1,
    })
  }
}
```
