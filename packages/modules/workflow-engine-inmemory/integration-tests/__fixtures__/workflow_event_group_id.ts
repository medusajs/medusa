import { createStep, createWorkflow } from "@medusajs/workflows-sdk"
import { setTimeout } from "timers/promises"

export const workflowEventGroupIdStep1Mock = jest.fn(async (input) => {
  await setTimeout(200)
})

export const workflowEventGroupIdStep2Mock = jest.fn(async (input) => {
  return
})

const step_1_background = createStep(
  {
    name: "step_1_event_group_id_background",
    async: true,
  },
  workflowEventGroupIdStep1Mock
)

const step_2 = createStep(
  {
    name: "step_2_event_group_id",
    async: true,
  },
  workflowEventGroupIdStep2Mock
)

export const eventGroupWorkflowId = "workflow_event_group_id"

createWorkflow(
  {
    name: eventGroupWorkflowId,
  },
  function (input) {
    const resp = step_1_background(input)
    step_2()

    return resp
  }
)
