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
}

export const MedusaProvider = ({
  queryClientProviderProps,
  baseUrl,
  children,
}: MedusaProviderProps) => {
  const medusaClient = new Medusa({ baseUrl, maxRetries: 0 })
  return (
    <QueryClientProvider {...queryClientProviderProps}>
      <MedusaContext.Provider value={{ client: medusaClient }}>
        {children}
      </MedusaContext.Provider>
    </QueryClientProvider>
  )
}
