import Medusa from "@medusajs/medusa-js"
import {
  QueryClientProvider,
  QueryClientProviderProps,
} from "@tanstack/react-query"
import React from "react"

interface MedusaContextState {
  client: Medusa
}

const MedusaContext = React.createContext<MedusaContextState | null>(null)

export const useMedusa = () => {
  const context = React.useContext(MedusaContext)
  if (!context) {
    throw new Error("useMedusa must be used within a MedusaProvider")
  }
  return context
}

interface MedusaProviderProps {
  baseUrl: string
  queryClientProviderProps: QueryClientProviderProps
  children: React.ReactNode
  /**
   * Authentication token
   */
  apiKey?: string
  /**
   * PublishableApiKey identifier that defines the scope of resources
   * available within the request
   */
  publishableApiKey?: string
  /**
   * Number of times to retry a request if it fails
   * @default 3
   */
  maxRetries?: number
  customHeaders?: Record<string, any>
}

export const MedusaProvider = ({
  queryClientProviderProps,
  baseUrl,
  apiKey,
  publishableApiKey,
  customHeaders,
  maxRetries = 3,
  children,
}: MedusaProviderProps) => {
  const medusaClient = new Medusa({
    baseUrl,
    maxRetries,
    apiKey,
    publishableApiKey,
    customHeaders,
  })
  return (
    <QueryClientProvider {...queryClientProviderProps}>
      <MedusaContext.Provider
        value={{
          client: medusaClient,
        }}
      >
        {children}
      </MedusaContext.Provider>
    </QueryClientProvider>
  )
}
