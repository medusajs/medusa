import { SchedulerOptions } from "@zjedene-medusa/framework/orchestration"
import {
  createStep,
  createWorkflow,
  StepResponse,
} from "@zjedene-medusa/framework/workflows-sdk"

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

  createWorkflow(
    { name, schedule: schedule ?? { interval: 1000 } },
    function (input) {
      return step(input)
    }
  )

  return workflowScheduledStepInvoke
}
