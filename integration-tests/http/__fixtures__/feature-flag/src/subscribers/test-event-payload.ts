import { defineFileConfig, FeatureFlag } from "@zjedene-medusa/framework/utils"

const testProductCreatedHandlerMock = jest.fn()

export default testProductCreatedHandlerMock

export const config = {
  event: "event.test",
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled("custom_ff"),
})
