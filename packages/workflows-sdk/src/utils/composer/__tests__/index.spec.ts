import { createStep } from "../create-step"
import { createWorkflow } from "../create-workflow"
import { StepResponse } from "../helpers"
import { transform } from "../transform"

describe("Workflow composer", () => {
  it("should not throw an unhandled error on failed transformer resolution after a step fail, but should rather push the errors in the errors result", async function () {
    const step1 = createStep("step1", async () => {
      return new StepResponse({ result: "step1" })
    })
    const step2 = createStep("step2", async () => {
      throw new Error("step2 failed")
    })

    const work = createWorkflow("id" as any, () => {
      const resStep1 = step1()
      const resStep2 = step2()

      const transformedData = transform({ data: resStep2 }, (data) => {
        return { result: data.data.result }
      })

      return transform({ data: transformedData, resStep2 }, (data) => {
        return { result: data.data }
      })
    })

    const { errors } = await work().run({ input: {}, throwOnError: false })

    expect(errors).toEqual([
      {
        action: "step2",
        handlerType: "invoke",
        error: expect.objectContaining({
          message: "step2 failed",
        }),
      },
      expect.objectContaining({
        message: "Cannot read properties of undefined (reading 'result')",
      }),
    ])
  })
})
