import React from "react"
import type { PropsWithChildren } from "react"
import { createRoot } from "react-dom/client"
import { MedusaProvider } from "medusa-react"
import "./assets/styles/global.css"
import "./assets/styles/fonts.css"
import { AccountProvider } from "./context/account"
import { CacheProvider } from "./context/cache"
import { InterfaceProvider } from "./context/interface"
import { medusaUrl } from "./services/config"
import queryClient from "./services/queryClient"
import App from "./App"
import { FeatureFlagProvider } from "./context/feature-flag"
import { SteppedProvider } from "./components/molecules/modal/stepped-modal"
import { LayeredModalProvider } from "./components/molecules/modal/layered-modal"

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
  // <React.StrictMode>
  <Page>
    <App />
  </Page>
  // </React.StrictMode>
)
