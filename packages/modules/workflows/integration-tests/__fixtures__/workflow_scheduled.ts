import { SchedulerOptions } from "@medusajs/framework/types"
import {
  createStep,
  createWorkflow,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"

export const createScheduled = (
  name: string,
  next: () => void,
  schedule?: SchedulerOptions
) => {
  const workflowScheduledStepInvoke = jest.fn((input, { container }) => {
    try {
      return new StepResponse({
        testValue: container.resolve("test-value", { allowUnregistered: true }),
      })
    } finally {
      next()
    }
  })

  const step = createStep("step_1", workflowScheduledStepInvoke)

  const workflow = createWorkflow(
    { name, schedule: schedule ?? "* * * * * *" },
    function (input) {
      return step(input)
    }
  )

  return { workflow, spy: workflowScheduledStepInvoke }
}
