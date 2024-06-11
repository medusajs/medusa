import { SchedulerOptions } from "@medusajs/orchestration"
import {
  createStep,
  createWorkflow,
  StepResponse,
} from "@medusajs/workflows-sdk"

export const createScheduled = (name: string, schedule?: SchedulerOptions) => {
  const workflowScheduledStepInvoke = jest.fn((input, context) => {
    return new StepResponse({})
  })

  const step = createStep("step_1", workflowScheduledStepInvoke)

  createWorkflow(
    { name, schedule: schedule ?? "* * * * * *" },
    function (input) {
      return step(input)
    }
  )

  return workflowScheduledStepInvoke
}
