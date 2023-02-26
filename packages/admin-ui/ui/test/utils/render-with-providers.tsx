import { render, RenderOptions } from "@testing-library/react"
import { MedusaProvider } from "medusa-react"
import { PropsWithChildren, ReactElement } from "react"
import { BrowserRouter } from "react-router-dom"
import { LayeredModalProvider } from "../../src/components/organisms/layered-modal"
import { SteppedProvider } from "../../src/components/organisms/stepped-modal"
import { queryClient } from "../../src/providers/medusa-provider"
import { FeatureFlagProvider } from "../providers/feature-flag-provider"

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <BrowserRouter>
      <MedusaProvider
        baseUrl={"http://localhost:9000"}
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
