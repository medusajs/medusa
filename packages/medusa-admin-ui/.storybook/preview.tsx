import { Toaster } from "react-hot-toast"
import { MemoryRouter } from "react-router-dom"
import "../src/assets/styles/global.css"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => {
    return (
      <MemoryRouter>
        <Story />
        <Toaster
          containerStyle={{
            top: 74,
            left: 24,
            bottom: 24,
            right: 24,
          }}
        />
      </MemoryRouter>
    )
  },
]
