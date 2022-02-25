# Medusa React

A React library providing a set of components, utilities, and hooks for interacting seamlessly with a Medusa backend and building custom React storefronts.

## Installation

The library uses [react-query](https://react-query.tanstack.com/overview) as a solution for server-side state management and lists the library as a peer dependency.

In order to install the package, run the following

```bash
npm install medusa-react react-query
# or
yarn add medusa-react react-query
```

## Quick Start

In order to use the hooks exposed by medusa-react, you will need to include the `MedusaProvider` somewhere up in your component tree. The `MedusaProvider` takes a `baseUrl` prop which should point to your Medusa server. Under the hood, `medusa-react` uses the `medusa-js` client library (built on top of axios) to interact with your server.

In addition, because medusa-react is built on top of react-query, you can pass an object representing react-query's [QueryClientProvider](https://react-query.tanstack.com/reference/QueryClientProvider#_top) props, which will be passed along by `MedusaProvider`.

```jsx
// App.tsx

import * as React from "react"
import { QueryClient } from "react-query"
import { MedusaProvider } from "../src"
import MyStorefront from "./my-storefront"

// Your react-query's query client config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30000,
      retry: 1,
    },
  },
})

const App = () => {
  return (
    <MedusaProvider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl="http://localhost:9000"
    >
      <MyStorefront />
    </MedusaProvider>
  )
}

export default App
```

The hooks exposed by `medusa-react` fall into two main categories: queries and mutations.

### Queries

[Queries](https://react-query.tanstack.com/guides/queries#_top) simply wrap around react-query's `useQuery` hook to fetch some data from your medusa server

```jsx
// ./my-storefront.tsx
import * as React from "react"
import { useProducts } from "medusa-react"

const MyStorefront = () => {
  const { products, isLoading } = useProducts()

  return isLoading ? (
    <Spinner />
  ) : (
    products.map((product) => <Product product={product} />)
  )
}
```

In general, the queries will return everything react-query returns from [`useQuery`](https://react-query.tanstack.com/reference/useQuery#_top) except the `data` field, which will be flattened out. In addition, you can also access the HTTP response object returned from the `medusa-js` client including things like `status`, `headers`, etc.

So, in other words, we can express what the above query returns as the following:

```typescript
import { UseQueryResult } from "react-query"

// This is what a Medusa server returns when you hit the GET /store/products endpoint
type ProductsResponse = {
  products: Product[]
  limit: number
  offset: number
}

// UseProductsQuery refers to what's returned by the useProducts hook
type UseProductsQuery = ProductsResponse &
  Omit<UseQueryResult, "data"> & {
    response: {
      status: number
      statusText: string
      headers: Record<string, string> & {
        "set-cookie"?: string[]
      }
      config: any
      request?: any
    }
  }

// More generally ...

type QueryReturnType = APIResponse &
  Omit<UseQueryResult, "data"> & {
    response: {
      status: number
      statusText: string
      headers: Record<string, string> & {
        "set-cookie"?: string[]
      }
      config: any
      request?: any
    }
  }
```

### Mutations

[Mutations](https://react-query.tanstack.com/guides/mutations#_top) wrap around react-query's `useMutation` to mutate data and perform server-side effects on your medusa server. If you are not entirely familiar with this idea of "mutations", creating a cart would be a mutation because it creates a cart in your server (and database). Mutations also have to be invoked imperatively, meaning that calling for the mutation to take action, you will have to call a `mutate()` function returned from mutation hooks.

```jsx
import * as React from "react"
import { useCreateCart } from "medusa-react"

const CreateCartButton = () => {
  const createCart = useCreateCart()
  const handleClick = () => {
    createCart.mutate({}) // create an empty cart
  }

  return (
    <Button isLoading={createCart.isLoading} onClick={handleClick}>
      Create cart
    </Button>
  )
}
```

The mutation hooks will return exactly what react-query's [`useMutation`](https://react-query.tanstack.com/reference/useMutation#_top) returns. In addition, the options you pass in to the hooks will be passed along to `useMutation`.

### Utilities

A set of utility functions are also exposed from the library to make your life easier when dealing with displaying money amounts

#### `formatVariantPrice()`

- `formatVariantPrice(params: FormatVariantPriceParams): string`

```typescript
type FormatVariantPriceParams = {
  variant: ProductVariantInfo
  region: RegionInfo
  includeTaxes?: boolean
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

type ProductVariantInfo = Pick<ProductVariant, "prices">

type RegionInfo = {
  currency_code: string
  tax_code: string
  tax_rate: number
}
```

Given a variant and region, will return a string representing the localized amount (i.e: `$19.50`)

The behavior of minimumFractionDigits and maximumFractionDigits is the same as the one explained by MDN [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat). In fact, in order to convert the decimal amount, we use the browser's `Intl.NumberFormat` method.

#### `computeVariantPrice()`

- `computeVariantPrice(params: ComputeVariantPriceParams): number`

```typescript
type ComputeVariantPriceParams = {
  variant: ProductVariantInfo
  region: RegionInfo
  includeTaxes?: boolean
}
```

Determines a variant's price based on the region provided. Returns a decimal number representing the amount.

#### `formatAmount()`

- `formatAmount(params: FormatAmountParams): string`

```typescript
type FormatAmountParams = {
  amount: number
  region: RegionInfo
  includeTaxes?: boolean
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}
```

Returns a localized string based on the input params representing the amount (i.e: "$10.99").

#### `computeAmount()`

- `computeAmount(params: ComputeAmountParams): number`

```typescript
type ComputeAmountParams = {
  amount: number
  region: RegionInfo
  includeTaxes?: boolean
}
```

Takes an integer amount, a region, and includeTaxes boolean. Returns a decimal amount including (or excluding) taxes.

### Context Providers (Experimental)

In order to make building custom storefronts easier, we also expose a `SessionCartProvider` and a `CartProvider` . At first, the two sound very similar to each other, however, the main distinction between the two is that the `SessionCartProvider` never interacts with your medusa server.

The main goal behind the provider is to manage the state related to your users' cart experience. In other words, the provider keeps track of the items users add to their cart and help you interact with those items through a set of helpful methods like `addItem`, `updateQuantity`, `removeItem` , etc.

On the other hand the `CartProvider` makes use of some of the hooks already exposed by `medusa-react` to help you create a cart (on the medusa backend), start the checkout flow, authorize payment sessions, etc. It also manages one single global piece of state which represents a cart, exactly like the one created on your medusa backend.

You can think of a `sessionCart` as a purely client-side lightweight cart, in other words, just a javascript object living in your browser, whereas `cart` is the entity which you have stored in your database.

### SessionCart

The first step to using the `SessionCartProvider` is by inserting it somewhere up in your component tree.

```jsx
// App.tsx

import * as React from "react"
import { QueryClient } from "react-query"
import { MedusaProvider, SessionCartProvider } from "medusa-react"
import MyStorefront from "./my-storefront"

// Your react-query's query client config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30000,
      retry: 1,
    },
  },
})

const App = () => {
  return (
    <MedusaProvider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl="http://localhost:9000"
    >
      <SessionCartProvider>
        <MyStorefront />
      </SessionCartProvider>
    </MedusaProvider>
  )
}

export default App
```

### Cart

```jsx
// App.tsx

import * as React from "react"
import { QueryClient } from "react-query"
import { MedusaProvider, CartProvider } from "medusa-react"
import MyStorefront from "./my-storefront"

// Your react-query's query client config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30000,
      retry: 1,
    },
  },
})

const App = () => {
  return (
    <MedusaProvider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl="http://localhost:9000"
    >
      <CartProvider>
        <MyStorefront />
      </CartProvider>
    </MedusaProvider>
  )
}

export default App
```
