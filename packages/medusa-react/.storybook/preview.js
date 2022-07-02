import React from "react"
import DefaultMedusaProvider from "./medusa-context"
import { initialize, mswDecorator } from "msw-storybook-addon"
import { adminHandlers, storeHandlers } from "../mocks/handlers"

initialize()

// https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
export const parameters = {
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: "^on.*" },
  msw: {
    handlers: [...adminHandlers, ...storeHandlers],
  },
}

export const decorators = [
  mswDecorator,
  (Story) => (
    <DefaultMedusaProvider>
      <Story />
    </DefaultMedusaProvider>
  ),
]
