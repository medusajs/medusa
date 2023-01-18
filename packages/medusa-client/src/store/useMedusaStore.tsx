/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { createContext, useContext, ReactNode } from 'react';
import { QueryClientProvider, QueryClientProviderProps } from 'react-query';
import { MedusaStore } from './MedusaStore';

interface MedusaStoreContextState {
  client: MedusaStore
}
const MedusaStoreContext = createContext<MedusaStoreContextState | null>(null)

export const useMedusaStore = () => {
  const context = useContext(MedusaStoreContext)
  if (!context) {
    throw new Error("useMedusaStore must be used within a MedusaStoreProvider")
  }
  return context
}

interface MedusaStoreProviderProps {
  baseUrl: string
  queryClientProviderProps: QueryClientProviderProps
  children: ReactNode
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

export const MedusaStoreProvider = ({
  queryClientProviderProps,
  baseUrl,
  apiKey,
  publishableApiKey,
  children,
}: MedusaStoreProviderProps) => {
  const client = new MedusaStore({
    BASE: baseUrl,
    WITH_CREDENTIALS: true,
  })
  return (
    <QueryClientProvider {...queryClientProviderProps}>
    <MedusaStoreContext.Provider value={ { client } }>
    {children}
    </MedusaStoreContext.Provider>
    </QueryClientProvider>
  )
}
