import React from "react"
import { QueryClientProvider, QueryClientProviderProps } from "react-query"
import Medusa from "@medusajs/medusa-js"

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
}

export const MedusaProvider = ({
  queryClientProviderProps,
  baseUrl,
  apiKey,
  publishableApiKey,
  children,
}: MedusaProviderProps) => {
  const medusaClient = new Medusa({
    baseUrl,
    maxRetries: 0,
    apiKey,
    publishableApiKey,
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
