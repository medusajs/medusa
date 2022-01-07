import React from "react"
import { QueryClientProvider, QueryClientProviderProps } from "react-query"
import Medusa from "@medusajs/medusa-js"

interface MedusaContextState {
  client: Medusa
  automaticAdminInvalidation: boolean
  automaticAdminUpdate: boolean
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
  const { automaticAdminUpdate, automaticAdminInvalidation } = useMedusa()

  return { automaticAdminUpdate, automaticAdminInvalidation }
}

interface MedusaProviderProps {
  baseUrl: string
  queryClientProviderProps: QueryClientProviderProps
  children: React.ReactNode
  apiKey?: string
  automaticAdminInvalidation?: boolean
  automaticAdminUpdate?: boolean
}

export const MedusaProvider = ({
  queryClientProviderProps,
  baseUrl,
  apiKey,
  children,
  automaticAdminInvalidation = true,
  automaticAdminUpdate = true,
}: MedusaProviderProps) => {
  const medusaClient = new Medusa({ baseUrl, maxRetries: 0, apiKey })
  return (
    <QueryClientProvider {...queryClientProviderProps}>
      <MedusaContext.Provider
        value={{
          client: medusaClient,
          automaticAdminInvalidation,
          automaticAdminUpdate,
        }}
      >
        {children}
      </MedusaContext.Provider>
    </QueryClientProvider>
  )
}
