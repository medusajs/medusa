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

In order to use the hooks exposed by medusa-react, you will need to include the `MedusaProvider` somewhere up in your component tree. The `MedusaProvider` takes a `medusaClient` prop which will be used to interact with your Medusa backend. Under the hood, `medusa-react` uses the `medusa-js` client library (built on top of axios).

In addition, because medusa-react is built on top of react-query, you can pass an object representing react-query's QueryClient props to be passed along by `MedusaProvider`.

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

The `useProducts` hooks makes use of react-query's `useQuery`. This means that along with the response returned from the Medusa backend, the `useProducts` hook also returns what `useQuery` returns, hence why in the example above, isLoading is also returned.

So, in other words, we can express what our query hooks return as the following:

```javascript
const { ...APIResponse, response, ...reactQueryUtils } = useSomeQuery();
```

The `response` object will include everything related to the HTTP response received by the client. Because the `medusa-js` client uses axios, the `response` object will be of type:

```
interface HTTPResponse {
  status: number
  statusText: string
  headers: Record<string, string> & {
    "set-cookie"?: string[]
  }
  config: any
  request?: any
}
```
