import { defineFileConfig, FeatureFlag } from "@zjedene-medusa/framework/utils"
import { createStep, createWorkflow } from "@zjedene-medusa/framework/workflows-sdk"

const testWorkflowHandler = jest.fn()

const step1 = createStep("step1", () => testWorkflowHandler())

export const testWorkflow = createWorkflow("test-workflow", () => {
  step1()
})

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled("custom_ff"),
})
