import { render } from "@testing-library/react"
import { MedusaProvider } from "medusa-react"
import React from "react"
import queryClient from "../../services/queryClient"

export function renderWithClient(ui: React.ReactElement) {
  const { rerender, ...result } = render(
    <MedusaProvider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl="/api"
    >
      {ui}
    </MedusaProvider>
  )
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <MedusaProvider
          queryClientProviderProps={{ client: queryClient }}
          baseUrl="/api"
        >
          {rerenderUi}
        </MedusaProvider>
      ),
  }
}
