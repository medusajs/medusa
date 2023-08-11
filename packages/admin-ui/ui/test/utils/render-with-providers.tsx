import { render, RenderOptions } from "@testing-library/react"
import { PropsWithChildren, ReactElement } from "react"
import { BrowserRouter } from "react-router-dom"
import { Providers } from "../../src/providers/providers"

const Wrapper = ({ children }: PropsWithChildren) => {
  return (
    <BrowserRouter>
      <Providers>{children}</Providers>
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: Wrapper, ...options })

export const renderWithProviders = (
  ui: ReactElement,
  { route = "/" } = {},
  options?: Omit<RenderOptions, "wrapper">
) => {
  window.history.pushState({}, "Test page", route)

  return customRender(ui, options)
}
