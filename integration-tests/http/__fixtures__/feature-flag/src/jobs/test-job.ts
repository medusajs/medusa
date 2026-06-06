import { MedusaContainer } from "@zjedene-medusa/framework/types"
import { defineFileConfig, FeatureFlag } from "@zjedene-medusa/framework/utils"

export const testJobHandler = jest.fn()

export default async function greetingJob(container: MedusaContainer) {
  testJobHandler()
}

export const config = {
  name: "greeting-every-second",
  numberOfExecutions: 1,
  schedule: "* * * * * *",
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled("custom_ff"),
})
