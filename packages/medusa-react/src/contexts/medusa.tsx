import React from "react"
import { QueryClientProvider, QueryClientProviderProps } from "react-query"
import Medusa from "@medusajs/medusa-js"

interface MedusaContextState {
  client: Medusa
  globalInvalidation: boolean
  globalUpdate: boolean
}

const MedusaContext = React.createContext<MedusaContextState | null>(null)

export const useMedusa = () => {
  const context = React.useContext(MedusaContext)
  if (!context) {
    throw new Error("useMedusa must be used within a MedusaProvider")
  }
  return context
}

export const useGlobalConfig = () => {
  const { globalInvalidation, globalUpdate } = useMedusa()

  return { globalInvalidation, globalUpdate }
}

interface MedusaProviderProps {
  baseUrl: string
  queryClientProviderProps: QueryClientProviderProps
  children: React.ReactNode
  apiKey?: string
  globalInvalidation?: boolean
  globalUpdate?: boolean
}

export const MedusaProvider = ({
  queryClientProviderProps,
  baseUrl,
  apiKey,
  children,
  globalInvalidation = true,
  globalUpdate = true,
}: MedusaProviderProps) => {
  const medusaClient = new Medusa({ baseUrl, maxRetries: 0, apiKey })
  return (
    <QueryClientProvider {...queryClientProviderProps}>
      <MedusaContext.Provider
        value={{
          client: medusaClient,
          globalInvalidation,
          globalUpdate,
        }}
      >
        {children}
      </MedusaContext.Provider>
    </QueryClientProvider>
  )
}
