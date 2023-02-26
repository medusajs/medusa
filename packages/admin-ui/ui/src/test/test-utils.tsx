import { render, RenderOptions } from "@testing-library/react"
import { MedusaProvider } from "medusa-react"
import { PropsWithChildren, ReactElement } from "react"
import { BrowserRouter } from "react-router-dom"
import { LayeredModalProvider } from "../components/molecules/modal/layered-modal"
import { SteppedProvider } from "../components/molecules/modal/stepped-modal"

import { FeatureFlagProvider } from "../providers/feature-flag-provider"

import { medusaUrl } from "../services/config"
import queryClient from "../services/queryClient"

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <BrowserRouter>
      <MedusaProvider
        baseUrl={medusaUrl}
        queryClientProviderProps={{
          client: queryClient,
        }}
      >
        <FeatureFlagProvider>
          <SteppedProvider>
            <LayeredModalProvider>{children}</LayeredModalProvider>
          </SteppedProvider>
        </FeatureFlagProvider>
      </MedusaProvider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: Providers, ...options })

export const renderWithProviders = (
  ui: ReactElement,
  { route = "/" } = {},
  options?: Omit<RenderOptions, "wrapper">
) => {
  window.history.pushState({}, "Test page", route)

  return customRender(ui, options)
}
