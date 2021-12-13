import * as React from "react"
import { QueryClient } from "react-query"
import { BagProvider, BagState, CartProvider, MedusaProvider } from "../src"
import { Cart } from "../src/types"

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

export function createWrapper() {
  const qc = createTestQueryClient()

  return ({ children }) => (
    <MedusaProvider queryClientProviderProps={{ client: qc }} baseUrl="">
      {children}
    </MedusaProvider>
  )
}

export function createBagWrapper() {
  const qc = createTestQueryClient()

  return ({
    children,
    initialState,
  }: {
    initialState: BagState
    children?: React.ReactNode
  }) => {
    return (
      <MedusaProvider queryClientProviderProps={{ client: qc }} baseUrl="">
        <BagProvider initialState={initialState}>{children}</BagProvider>
      </MedusaProvider>
    )
  }
}

export function createCartWrapper() {
  const qc = createTestQueryClient()

  return ({
    children,
    initialBagState,
    initialCartState,
  }: {
    initialBagState?: BagState
    initialCartState?: Cart
    children?: React.ReactNode
  }) => {
    return (
      <MedusaProvider queryClientProviderProps={{ client: qc }} baseUrl="">
        <BagProvider initialState={initialBagState}>
          <CartProvider initialState={initialCartState}>
            {children}
          </CartProvider>
        </BagProvider>
      </MedusaProvider>
    )
  }
}
