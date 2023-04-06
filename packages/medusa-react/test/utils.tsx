import { QueryClient } from "@tanstack/react-query"
import * as React from "react"
import {
  CartProvider,
  MedusaProvider,
  SessionCartProvider,
  SessionCartState,
} from "../src"
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

export function createSessionCartWrapper() {
  const qc = createTestQueryClient()

  return ({
    children,
    initialState,
  }: {
    initialState: SessionCartState
    children?: React.ReactNode
  }) => {
    return (
      <MedusaProvider queryClientProviderProps={{ client: qc }} baseUrl="">
        <SessionCartProvider initialState={initialState}>
          {children}
        </SessionCartProvider>
      </MedusaProvider>
    )
  }
}

export function createCartWrapper() {
  const qc = createTestQueryClient()

  return ({
    children,
    initialSessionCartState,
    initialCartState,
  }: {
    initialSessionCartState?: SessionCartState
    initialCartState?: Cart
    children?: React.ReactNode
  }) => {
    return (
      <MedusaProvider queryClientProviderProps={{ client: qc }} baseUrl="">
        <SessionCartProvider initialState={initialSessionCartState}>
          <CartProvider initialState={initialCartState}>
            {children}
          </CartProvider>
        </SessionCartProvider>
      </MedusaProvider>
    )
  }
}
