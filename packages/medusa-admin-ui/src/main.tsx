import { MedusaProvider } from "medusa-react"
import type { PropsWithChildren } from "react"
import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./assets/styles/global.css"
import { LayeredModalProvider } from "./components/molecules/modal/layered-modal"
import { SteppedProvider } from "./components/molecules/modal/stepped-modal"
import { AccountProvider } from "./context/account"
import { CacheProvider } from "./context/cache"
import { FeatureFlagProvider } from "./context/feature-flag"
import { InterfaceProvider } from "./context/interface"
import { medusaUrl } from "./services/config"
import queryClient from "./services/queryClient"

const Page = ({ children }: PropsWithChildren) => {
  return (
    <MedusaProvider
      baseUrl={medusaUrl}
      queryClientProviderProps={{
        client: queryClient,
      }}
    >
      <CacheProvider>
        <AccountProvider>
          <FeatureFlagProvider>
            <InterfaceProvider>
              <SteppedProvider>
                <LayeredModalProvider>{children}</LayeredModalProvider>
              </SteppedProvider>
            </InterfaceProvider>
          </FeatureFlagProvider>
        </AccountProvider>
      </CacheProvider>
    </MedusaProvider>
  )
}

const root = createRoot(document.getElementById("root")!)
root.render(
  <React.StrictMode>
    <Page>
      <App />
    </Page>
  </React.StrictMode>
)
