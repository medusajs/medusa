import { Composer, createWorkflow } from "../composer"
import {
  createHook,
  createStep,
  parallelize,
  StepResponse,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "../../utils/composer"
import { MedusaWorkflow } from "../../medusa-workflow"
import {
  IDistributedSchedulerStorage,
  SchedulerOptions,
  WorkflowManager,
  WorkflowScheduler,
} from "@medusajs/orchestration"

jest.setTimeout(30000)

class MockSchedulerStorage implements IDistributedSchedulerStorage {
  async schedule(
    jobDefinition: string | { jobId: string },
    schedulerOptions: SchedulerOptions
  ): Promise<void> {
    return Promise.resolve()
  }
  async remove(jobId: string): Promise<void> {
    return Promise.resolve()
  }
  async removeAll(): Promise<void> {
    return Promise.resolve()
  }
}

WorkflowScheduler.setStorage(new MockSchedulerStorage())

const afterEach_ = () => {
  jest.clearAllMocks()
  MedusaWorkflow.workflows = {}
  WorkflowManager.unregisterAll()
}

describe("composer", () => {
  afterEach(afterEach_)

  describe("Using backword compatibility", function () {
    afterEach(afterEach_)

    it("should compose a new workflow and run it", async () => {
      const step1 = createStep("step1", async (data: { input: string }) => {
        return new StepResponse(data)
      })

      const workflow = createWorkflow(
        "test",
        (
          input: WorkflowData<{ input: string }>
        ): WorkflowResponse<{ input: string }> => {
          const test = step1(input)
          return new WorkflowResponse(test)
        }
      )

      const workflowResult = await workflow.run({
        input: "test",
      })

      expect(workflowResult.result).toEqual("test")
    })

    it("should register hooks and execute them", async () => {
      const step1 = createStep("step1", async (data: { input: string }) => {
        return new StepResponse(data)
      })

      const workflow = createWorkflow(
        "test",
        (input: WorkflowData<{ input: string }>) => {
          const test = step1(input)

          const hook = createHook("test", test)
          return new WorkflowResponse(test, {
            hooks: [hook],
          })
        }
      )

      const hookHandler = jest.fn().mockImplementation(() => {
        return "test hook"
      })
      workflow.hooks.test(hookHandler)

      const workflowResult = await workflow.run({
        input: "test",
      })

      expect(workflowResult.result).toEqual("test")
      expect(hookHandler).toHaveBeenCalledWith("test", expect.any(Object))
    })

    it("should allow to perform data transformation", async () => {
      const step1 = createStep("step1", async (data: { input: string }) => {
        return new StepResponse(data)
      })

      const workflow = createWorkflow(
        "test",
        (input: WorkflowData<{ input: string }>) => {
          const test = step1(input)
          const result = transform({ input: test }, (data) => {
            return "transformed result"
          })

          return new WorkflowResponse(result)
        }
      )
      const workflowResult = await workflow.run({
        input: "test",
      })

      expect(workflowResult.result).toEqual("transformed result")
    })

    it("should allow to perform data transformation", async () => {
      const step1 = createStep("step1", async (data: { input: string }) => {
        return new StepResponse(data)
      })

      const workflow = createWorkflow(
        "test",
        (input: WorkflowData<{ input: string }>) => {
          const test = step1(input)
          const result = transform({ input: test }, (data) => {
            return "transformed result"
          })

          return new WorkflowResponse(result)
        }
      )
      const workflowResult = await workflow.run({
        input: "test",
      })

      expect(workflowResult.result).toEqual("transformed result")
    })

    it("should allow to run steps concurrently", async () => {
      const step1 = createStep("step1", async (data: { input: string }) => {
        return new StepResponse(data)
      })

      const step2 = createStep("step2", async (data: { input: string }) => {
        return new StepResponse(data)
      })

      const workflow = createWorkflow(
        "test",
        (input: WorkflowData<{ input: string }>) => {
          const [res1, res2] = parallelize(step1(input), step2(input))
          return new WorkflowResponse({ res1, res2 })
        }
      )

      const workflowResult = await workflow.run({
        input: "test",
      })

      expect(workflowResult.result).toEqual({ res1: "test", res2: "test" })
    })
  })

  it("should compose a new workflow and run it", async () => {
    const step1 = createStep("step1", async (data: { input: string }) => {
      return new StepResponse(data)
    })

    const workflow = Composer.createWorkflow(
      "test",
      (
        input: WorkflowData<{ input: string }>
      ): WorkflowResponse<{ input: string }> => {
        const test = step1(input)
        return new WorkflowResponse(test)
      }
    )

    const workflowResult = await workflow.run({
      input: "test",
    })

    expect(workflowResult.result).toEqual("test")
  })

  it("should register hooks and execute them", async () => {
    const step1 = createStep("step1", async (data: { input: string }) => {
      return new StepResponse(data)
    })

    const workflow = Composer.createWorkflow(
      "test",
      (input: WorkflowData<{ input: string }>) => {
        const test = step1(input)

        const hook = createHook("test", test)
        return new WorkflowResponse(test, {
          hooks: [hook],
        })
      }
    )

    const hookHandler = jest.fn().mockImplementation(() => {
      return "test hook"
    })
    workflow.hooks.test(hookHandler)

    const workflowResult = await workflow.run({
      input: "test",
    })

    expect(workflowResult.result).toEqual("test")
    expect(hookHandler).toHaveBeenCalledWith("test", expect.any(Object))
  })

  it("should allow to perform data transformation", async () => {
    const step1 = createStep("step1", async (data: { input: string }) => {
      return new StepResponse(data)
    })

    const workflow = Composer.createWorkflow(
      "test",
      (input: WorkflowData<{ input: string }>) => {
        const test = step1(input)
        const result = transform({ input: test }, (data) => {
          return "transformed result"
        })

        return new WorkflowResponse(result)
      }
    )
    const workflowResult = await workflow.run({
      input: "test",
    })

    expect(workflowResult.result).toEqual("transformed result")
  })

  it("should allow to perform data transformation", async () => {
    const step1 = createStep("step1", async (data: { input: string }) => {
      return new StepResponse(data)
    })

    const workflow = Composer.createWorkflow(
      "test",
      (input: WorkflowData<{ input: string }>) => {
        const test = step1(input)
        const result = transform({ input: test }, (data) => {
          return "transformed result"
        })

        return new WorkflowResponse(result)
      }
    )
    const workflowResult = await workflow.run({
      input: "test",
    })

    expect(workflowResult.result).toEqual("transformed result")
  })

  it("should allow to run steps concurrently", async () => {
    const step1 = createStep("step1", async (data: { input: string }) => {
      return new StepResponse(data)
    })

    const step2 = createStep("step2", async (data: { input: string }) => {
      return new StepResponse(data)
    })

    const workflow = Composer.createWorkflow(
      "test",
      (input: WorkflowData<{ input: string }>) => {
        const [res1, res2] = parallelize(step1(input), step2(input))
        return new WorkflowResponse({ res1, res2 })
      }
    )

    const workflowResult = await workflow.run({
      input: "test",
    })

    expect(workflowResult.result).toEqual({ res1: "test", res2: "test" })
  })
})
