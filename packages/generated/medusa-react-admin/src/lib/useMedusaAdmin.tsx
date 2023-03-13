/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import React from 'react';
import { createContext, useContext, ReactNode } from 'react';
import { QueryClientProvider, QueryClientProviderProps } from 'react-query';
import { MedusaAdmin } from '@medusajs/medusa-client-admin';

interface MedusaAdminContextState {
  client: MedusaAdmin
}
const MedusaAdminContext = createContext<MedusaAdminContextState | null>(null)

export const useMedusaAdmin = () => {
  const context = useContext(MedusaAdminContext)
  if (!context) {
    throw new Error("useMedusaAdmin must be used within a MedusaAdminProvider")
  }
  return context
}

interface MedusaAdminProviderProps {
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

export const MedusaAdminProvider = ({
  queryClientProviderProps,
  baseUrl,
  children,
}: MedusaAdminProviderProps) => {
  const client = new MedusaAdmin({
    BASE: baseUrl,
    WITH_CREDENTIALS: true,
  })
  return (
    <QueryClientProvider {...queryClientProviderProps}>
    <MedusaAdminContext.Provider value={ { client } }>
    {children}
    </MedusaAdminContext.Provider>
    </QueryClientProvider>
  )
}
