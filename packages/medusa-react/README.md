# Medusa React

A React library providing a set of components, utilities, and hooks for interacting seamlessly with a Medusa backend and building custom React storefronts.

## Installation

The library uses react-query as a solution for server-side state management and lists the library as a peer dependency.

In order to install the package, run the following

```bash
npm install @medusajs/medusa-react react-query
# or
yarn add @medusajs/medusa-react react-query
```

## Quick Start

In order to use the hooks exposed by medusa-react, you will need to include the `MedusaProvider` somewhere up in your component tree. The `MedusaProvider` takes a `baseUrl` prop which should point to your Medusa server. Under the hood, `medusa-react` uses the `medusa-js` client library (built on top of axios) to interact with your server.

In addition, because medusa-react is built on top of react-query, you can pass an object representing react-query's QueryClient props,which will be passed along by `MedusaProvider`.

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

Queries simply wrap around react-query's `useQuery` hook to fetch some data from your medusa server

```jsx
// ./my-storefront.tsx
import * as React from "react"
import { useProducts } from "@medusajs/medusa-react"

const MyStorefront = () => {
  const { products, isLoading } = useProducts()

  return isLoading ? (
    <Spinner />
  ) : (
    products.map((product) => <Product product={product} />)
  )
}
```

In general, the queries will return everything react-query returns from `useQuery` except the `data` field, which will be flattened out. In addition, you can also access the HTTP response object returned from the `medusa-js` client including things like `status`, `headers`, etc.

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

Mutations wrap around react-query's `useMutation` to mutate data on your medusa server.

```jsx
import * as React from "react"
import { useCreateCart } from "@medusajs/medusa-react"

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

The mutation hooks will return exactly what react-query's `useMutation` returns. In addition, the options you pass in to the hooks will be passed along to `useMutation`.
