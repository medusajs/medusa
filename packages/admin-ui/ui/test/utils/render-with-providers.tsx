import { render, RenderOptions } from "@testing-library/react"
import { PropsWithChildren, ReactElement } from "react"
import { BrowserRouter } from "react-router-dom"
import { KitchenSink } from "../../src/providers"

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <BrowserRouter>
      <KitchenSink>{children}</KitchenSink>
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
