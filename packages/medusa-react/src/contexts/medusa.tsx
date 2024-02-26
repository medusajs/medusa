/**
 * @packageDocumentation
 * 
 * @customNamespace Providers.Medusa
 */

import Medusa from "@medusajs/medusa-js"
import {
  QueryClientProvider,
  QueryClientProviderProps,
} from "@tanstack/react-query"
import React from "react"

export interface MedusaContextState {
  /**
   * The Medusa JS Client instance.
   */
  client: Medusa
}

const MedusaContext = React.createContext<MedusaContextState | null>(null)

/**
 * This hook gives you access to context of {@link MedusaProvider}. It's useful if you want access to the 
 * [Medusa JS Client](https://docs.medusajs.com/js-client/overview).
 * 
 * @example
 * import React from "react"
 * import { useMeCustomer, useMedusa } from "medusa-react"
 * 
 * const CustomerLogin = () => {
 *   const { client } = useMedusa()
 *   const { refetch: refetchCustomer } = useMeCustomer()
 *   // ...
 * 
 *   const handleLogin = (
 *     email: string,
 *     password: string
 *   ) => {
 *     client.auth.authenticate({
 *       email,
 *       password
 *     })
 *     .then(() => {
 *       // customer is logged-in successfully
 *       refetchCustomer()
 *     })
 *     .catch(() => {
 *       // an error occurred.
 *     })
 *   }
 * 
 *   // ...
 * }
 * 
 * @customNamespace Providers.Medusa
 */
export const useMedusa = () => {
  const context = React.useContext(MedusaContext)
  if (!context) {
    throw new Error("useMedusa must be used within a MedusaProvider")
  }
  return context
}

export interface MedusaProviderProps {
  /**
   * The URL to your Medusa backend.
   */
  baseUrl: string
  /**
   * An object used to set the Tanstack Query client. The object requires a `client` property, 
   * which should be an instance of [QueryClient](https://tanstack.com/query/v4/docs/react/reference/QueryClient).
   */
  queryClientProviderProps: QueryClientProviderProps
  /**
   * @ignore
   */
  children: React.ReactNode
  /**
   * API key used for authenticating admin requests. Follow [this guide](https://docs.medusajs.com/api/admin#authentication) to learn how to create an API key for an admin user.
   */
  apiKey?: string
  /**
   * Publishable API key used for storefront requests. You can create a publishable API key either using the 
   * [admin APIs](https://docs.medusajs.com/development/publishable-api-keys/admin/manage-publishable-api-keys) or the 
   * [Medusa admin](https://docs.medusajs.com/user-guide/settings/publishable-api-keys#create-publishable-api-key).
   */
  publishableApiKey?: string
  /**
   * Number of times to retry a request if it fails.
   * 
   * @defaultValue 3
   */
  maxRetries?: number
  /**
   * An object of custom headers to pass with every request. Each key of the object is the name of the header, and its value is the header's value.
   * 
   * @defaultValue `{}`
   */
  customHeaders?: Record<string, any>
  /**
   * An instance of the Medusa JS Client. If you don't provide an instance, one will be created using the `baseUrl`, `apiKey`, 
   * `publishableApiKey`, `maxRetries`, and `customHeaders` props.
   */
  medusaClient?: Medusa
}

/**
 * The `MedusaProvider` must be used at the highest possible point in the React component tree. Using any of `medusa-react`'s hooks or providers requires having `MedusaProvider`
 * higher in the component tree.
 * 
 * @param {MedusaProviderProps} param0 - Props of the provider.
 * 
 * @example
 * ```tsx title="src/App.ts"
 * import { MedusaProvider } from "medusa-react"
 * import Storefront from "./Storefront"
 * import { QueryClient } from "@tanstack/react-query"
 * import React from "react"
 * 
 * const queryClient = new QueryClient()
 * 
 * const App = () => {
 *   return (
 *     <MedusaProvider
 *       queryClientProviderProps={{ client: queryClient }}
 *       baseUrl="http://localhost:9000"
 *     >
 *       <Storefront />
 *     </MedusaProvider>
 *   )
 * }
 * 
 * export default App
 * ```
 * 
 * In the example above, you wrap the `Storefront` component with the `MedusaProvider`. `Storefront` is assumed to be the top-level component of your storefront, but you can place `MedusaProvider` at any point in your tree. Only children of `MedusaProvider` can benefit from its hooks.
 * 
 * The `Storefront` component and its child components can now use hooks exposed by Medusa React.
 * 
 * @customNamespace Providers.Medusa
 */
export const MedusaProvider = ({
  queryClientProviderProps,
  baseUrl,
  apiKey,
  publishableApiKey,
  customHeaders,
  maxRetries = 3,
  children,
  medusaClient = new Medusa({
    baseUrl,
    maxRetries,
    apiKey,
    publishableApiKey,
    customHeaders,
  }),
}: MedusaProviderProps) => {
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
