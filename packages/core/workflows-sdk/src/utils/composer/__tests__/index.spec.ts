import { z } from "@medusajs/deps/zod"
import { expectTypeOf } from "expect-type"
import { TransactionState } from "@medusajs/utils"
import { createStep } from "../create-step"
import { createWorkflow } from "../create-workflow"
import { StepResponse } from "../helpers"
import { WorkflowResponse } from "../helpers/workflow-response"
import { transform } from "../transform"
import { WorkflowData } from "../type"
import { when } from "../when"
import { createHook } from "../create-hook"
import { TransactionStepsDefinition } from "@medusajs/orchestration"

let count = 1
const getNewWorkflowId = () => `workflow-${count++}`

describe("Workflow composer", () => {
  describe("when running workflows as sub-workflows", () => {
    describe("handling of async and nested workflow configurations", () => {
      it("should set the runAsStep as nested and async when parent workflow is async", async () => {
        const subworkflowStep1 = createStep("step1", async (_, context) => {
          return new StepResponse({ result: "sub workflow step1" })
        })

        const subWorkflowId = getNewWorkflowId()
        const subWorkflow = createWorkflow(
          subWorkflowId,
          function (input: WorkflowData<string>) {
            subworkflowStep1()
            return new WorkflowResponse(void 0)
          }
        )

        const step1 = createStep(
          { name: "step1", async: true },
          async (_, context) => {
            return new StepResponse({ result: "step1" })
          }
        )

        const workflowId = getNewWorkflowId()
        const workflow = createWorkflow(workflowId, function () {
          step1()

          const subWorkflowRes = subWorkflow.runAsStep({
            input: "hi from outside",
          })

          return new WorkflowResponse(subWorkflowRes)
        })

        expect(workflow().getFlow().async).toBe(true)
        expect(subWorkflow().getFlow().async).toBeUndefined()

        const runAsStep = workflow().getFlow()
          .next! as TransactionStepsDefinition

        expect(runAsStep.action).toBe(`${subWorkflowId}-as-step`)
        expect(runAsStep.async).toBe(true)
        expect(runAsStep.nested).toBe(true)
      })

      it("should set the runAsStep as nested and async when parent workflow is sync but sub workflow is async", async () => {
        const subworkflowStep1 = createStep(
          { name: "step1", async: true },
          async (_, context) => {
            return new StepResponse({ result: "sub workflow step1" })
          }
        )

        const subWorkflowId = getNewWorkflowId()
        const subWorkflow = createWorkflow(
          subWorkflowId,
          function (input: WorkflowData<string>) {
            subworkflowStep1()
            return new WorkflowResponse(void 0)
          }
        )

        const step1 = createStep("step1", async (_, context) => {
          return new StepResponse({ result: "step1" })
        })

        const workflowId = getNewWorkflowId()
        const workflow = createWorkflow(workflowId, function () {
          step1()

          const subWorkflowRes = subWorkflow.runAsStep({
            input: "hi from outside",
          })

          return new WorkflowResponse(subWorkflowRes)
        })

        expect(workflow().getFlow().async).toBeUndefined()
        expect(subWorkflow().getFlow().async).toBe(true)

        const runAsStep = workflow().getFlow()
          .next! as TransactionStepsDefinition

        expect(runAsStep.action).toBe(`${subWorkflowId}-as-step`)
        expect(runAsStep.async).toBe(true)
        expect(runAsStep.nested).toBe(true)
      })

      it("should set the runAsStep as nested and async when parent workflow is sync as well as sub workflow but the step is configured as async", async () => {
        const subworkflowStep1 = createStep("step1", async (_, context) => {
          return new StepResponse({ result: "sub workflow step1" })
        })

        const subWorkflowId = getNewWorkflowId()
        const subWorkflow = createWorkflow(
          subWorkflowId,
          function (input: WorkflowData<string>) {
            subworkflowStep1()
            return new WorkflowResponse({})
          }
        )

        const step1 = createStep("step1", async (_, context) => {
          return new StepResponse({ result: "step1" })
        })

        const workflowId = getNewWorkflowId()
        const workflow = createWorkflow(workflowId, function () {
          step1()

          const subWorkflowRes = subWorkflow
            .runAsStep({
              input: "hi from outside",
            })
            .config({ async: true })

          return new WorkflowResponse(subWorkflowRes)
        })

        expect(workflow().getFlow().async).toBeUndefined()
        expect(subWorkflow().getFlow().async).toBeUndefined()

        const runAsStep = workflow().getFlow()
          .next! as TransactionStepsDefinition

        expect(runAsStep.action).toBe(`${subWorkflowId}-as-step`)
        expect(runAsStep.async).toBe(true)
        expect(runAsStep.nested).toBe(true)
      })
    })

    it("should succeed", async function () {
      const step1 = createStep("step1", async (_, context) => {
        return new StepResponse({ result: "step1" })
      })
      const step2 = createStep("step2", async (input: string, context) => {
        return new StepResponse({ result: input })
      })
      const step3 = createStep("step3", async (input: string, context) => {
        return new StepResponse({ result: input })
      })

      const subWorkflow = createWorkflow(
        getNewWorkflowId(),
        function (input: WorkflowData<string>) {
          step1()
          return new WorkflowResponse(step2(input))
        }
      )

      const workflow = createWorkflow(getNewWorkflowId(), function () {
        const subWorkflowRes = subWorkflow.runAsStep({
          input: "hi from outside",
        })
        return new WorkflowResponse(step3(subWorkflowRes.result))
      })

      const { result } = await workflow.run({ input: {} })

      expect(result).toEqual({ result: "hi from outside" })
    })

    it("should cancel transaction on failed sub workflow call", async function () {
      const step1 = createStep("step1", async (_, context) => {
        return new StepResponse("step1")
      })

      const step2 = createStep("step2", async (input: string, context) => {
        return new StepResponse({ result: input })
      })
      const step3 = createStep("step3", async (input: string, context) => {
        throw new Error("I have failed")
      })

      const subWorkflow = createWorkflow(
        getNewWorkflowId(),
        function (input: WorkflowData<string>) {
          step1()
          return new WorkflowResponse(step2(input))
        }
      )

      const workflow = createWorkflow(getNewWorkflowId(), function () {
        const subWorkflowRes = subWorkflow.runAsStep({
          input: "hi from outside",
        })
        return new WorkflowResponse(step3(subWorkflowRes.result))
      })

      const { errors, transaction } = await workflow.run({
        input: {},
        throwOnError: false,
      })

      expect(errors).toHaveLength(1)
      expect(errors[0].error.message).toEqual("I have failed")

      expect(transaction.getState()).toEqual(TransactionState.REVERTED)
    })

    it("should skip step if condition is false", async function () {
      const step1 = createStep("step1", async (_, context) => {
        return new StepResponse({ result: "step1" })
      })
      const step2 = createStep("step2", async (input: string, context) => {
        return new StepResponse({ result: input })
      })
      const step3 = createStep(
        "step3",
        async (input: string | undefined, context) => {
          return new StepResponse({ result: input ?? "default response" })
        }
      )

      const subWorkflow = createWorkflow(
        getNewWorkflowId(),
        function (input: WorkflowData<string>) {
          step1()
          return new WorkflowResponse(step2(input))
        }
      )

      const workflow = createWorkflow(
        getNewWorkflowId(),
        function (input: { callSubFlow: boolean }) {
          const subWorkflowRes = when({ input }, ({ input }) => {
            return input.callSubFlow
          }).then(() => {
            return subWorkflow.runAsStep({
              input: "hi from outside",
            })
          })

          return new WorkflowResponse(step3(subWorkflowRes!.result))
        }
      )

      const { result } = await workflow.run({ input: { callSubFlow: false } })

      expect(result).toEqual({ result: "default response" })
    })

    it("should not skip step if condition is true", async function () {
      const step1 = createStep("step1", async (_, context) => {
        return new StepResponse({ result: "step1" })
      })
      const step2 = createStep("step2", async (input: string, context) => {
        return new StepResponse({ result: input })
      })
      const step3 = createStep(
        "step3",
        async (input: string | undefined, context) => {
          return new StepResponse({ result: input ?? "default response" })
        }
      )

      const subWorkflow = createWorkflow(
        getNewWorkflowId(),
        function (input: WorkflowData<string>) {
          step1()
          return new WorkflowResponse(step2(input))
        }
      )

      const workflow = createWorkflow(
        getNewWorkflowId(),
        function (input: { callSubFlow: boolean }) {
          const subWorkflowRes = when({ input }, ({ input }) => {
            return input.callSubFlow
          }).then(() => {
            return subWorkflow.runAsStep({
              input: "hi from outside",
            })
          })

          return new WorkflowResponse(step3(subWorkflowRes!.result))
        }
      )

      const { result } = await workflow.run({
        input: { callSubFlow: true },
      })

      expect(result).toEqual({ result: "hi from outside" })

      const { result: res2 } = await workflow.run({
        input: { callSubFlow: false },
      })

      expect(res2).toEqual({ result: "default response" })
    })

    it("should not return value if when condition is false", async function () {
      const workflow = createWorkflow(
        getNewWorkflowId(),
        function (input: { ret: boolean }) {
          const value = when({ input }, ({ input }) => {
            return input.ret
          }).then(() => {
            return { hasValue: true }
          })

          return new WorkflowResponse(value)
        }
      )

      const { result } = await workflow.run({
        input: { ret: false },
      })

      expect(result).toEqual(undefined)

      const { result: res2 } = await workflow.run({
        input: { ret: true },
      })

      expect(res2).toEqual({ hasValue: true })
    })

    it("should revert the workflow and sub workflow on failure", async function () {
      const step1Mock = jest.fn()
      const step1 = createStep(
        "step1",
        async () => {
          return new StepResponse({ result: "step1" })
        },
        step1Mock
      )

      const step2Mock = jest.fn()
      const step2 = createStep(
        "step2",
        async (input: string) => {
          return new StepResponse({ result: input })
        },
        step2Mock
      )

      const step3Mock = jest.fn()
      const step3 = createStep(
        "step3",
        async () => {
          return new StepResponse()
        },
        step3Mock
      )

      const step4WithError = createStep("step4", async () => {
        throw new Error("Step4 failed")
      })

      const subWorkflow = createWorkflow(
        getNewWorkflowId(),
        function (input: WorkflowData<string>) {
          step1()
          return new WorkflowResponse(step2(input))
        }
      )

      const workflow = createWorkflow(getNewWorkflowId(), function () {
        step3()
        const subWorkflowRes = subWorkflow.runAsStep({
          input: "hi from outside",
        })
        step4WithError()
        return new WorkflowResponse(subWorkflowRes)
      })

      const { errors } = await workflow.run({ throwOnError: false })

      expect(errors).toEqual([
        expect.objectContaining({
          error: expect.objectContaining({
            message: "Step4 failed",
          }),
        }),
      ])

      expect(step1Mock).toHaveBeenCalledTimes(1)
      expect(step2Mock).toHaveBeenCalledTimes(1)
      expect(step3Mock).toHaveBeenCalledTimes(1)
    })

    it("should succeed and pass down the transaction id and event group id when provided from the context", async function () {
      let parentContext, childContext

      const childWorkflowStep1 = createStep("step1", async (_, context) => {
        childContext = context
        return new StepResponse({ result: "step1" })
      })
      const childWorkflowStep2 = createStep(
        "step2",
        async (input: string, context) => {
          return new StepResponse({ result: input })
        }
      )
      const step1 = createStep("step3", async (input: string, context) => {
        parentContext = context
        return new StepResponse({ result: input })
      })

      const wfId = getNewWorkflowId()
      const subWorkflow = createWorkflow(
        wfId,
        function (input: WorkflowData<string>) {
          childWorkflowStep1()
          return new WorkflowResponse(childWorkflowStep2(input))
        }
      )

      const workflow = createWorkflow(getNewWorkflowId(), function () {
        const subWorkflowRes = subWorkflow.runAsStep({
          input: "hi from outside",
        })
        return new WorkflowResponse(step1(subWorkflowRes.result))
      })

      const { result } = await workflow.run({
        input: {},
        context: {
          eventGroupId: "eventGroupId",
          transactionId: "transactionId",
        },
      })

      expect(result).toEqual({ result: "hi from outside" })

      expect(parentContext.transactionId).toEqual(expect.any(String))
      expect(childContext.transactionId).toEqual(
        wfId + "-as-step-" + parentContext.transactionId
      )

      expect(parentContext.eventGroupId).toEqual("eventGroupId")
      expect(parentContext.eventGroupId).toEqual(childContext.eventGroupId)
    })

    it("should succeed and pass down the transaction id and event group id when not provided from the context", async function () {
      let parentContext, childContext

      const childWorkflowStep1 = createStep("step1", async (_, context) => {
        childContext = context
        return new StepResponse({ result: "step1" })
      })
      const childWorkflowStep2 = createStep(
        "step2",
        async (input: string, context) => {
          return new StepResponse({ result: input })
        }
      )
      const step1 = createStep("step3", async (input: string, context) => {
        parentContext = context
        return new StepResponse({ result: input })
      })

      const wfId = getNewWorkflowId()
      const subWorkflow = createWorkflow(
        wfId,
        function (input: WorkflowData<string>) {
          childWorkflowStep1()
          return new WorkflowResponse(childWorkflowStep2(input))
        }
      )

      const workflow = createWorkflow(getNewWorkflowId(), function () {
        const subWorkflowRes = subWorkflow.runAsStep({
          input: "hi from outside",
        })
        return new WorkflowResponse(step1(subWorkflowRes.result))
      })

      const { result } = await workflow.run({
        input: {},
      })

      expect(result).toEqual({ result: "hi from outside" })

      expect(parentContext.transactionId).toBeTruthy()
      expect(childContext.transactionId).toEqual(
        wfId + "-as-step-" + parentContext.transactionId
      )

      expect(parentContext.eventGroupId).toBeTruthy()
      expect(parentContext.eventGroupId).toEqual(childContext.eventGroupId)
    })
  })

  it("should not throw an unhandled error on failed transformer resolution after a step fail, but should rather push the errors in the errors result", async function () {
    const step1 = createStep("step1", async () => {
      return new StepResponse({ result: "step1" })
    })
    const step2 = createStep("step2", async () => {
      throw new Error("step2 failed")
    })

    const work = createWorkflow("id" as any, () => {
      step1()
      const resStep2 = step2()

      const transformedData = transform({ data: resStep2 }, (data) => {
        // @ts-expect-error "Since we are reading result from undefined"
        return { result: data.data.result }
      })

      return new WorkflowResponse(
        transform({ data: transformedData, resStep2 }, (data) => {
          return { result: data.data }
        })
      )
    })

    const { errors } = await work.run({ input: {}, throwOnError: false })

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

  it("should allow reading results for a given step", async function () {
    const step1 = createStep("step1", async (_, context) => {
      return new StepResponse({ result: "step1" })
    })
    const step2 = createStep("step2", async (input: string, context) => {
      return new StepResponse({ result: input })
    })
    const step3 = createStep("step3", async (input: string, context) => {
      return new StepResponse({
        input,
        step2: context[" getStepResult"]("step2"),
        step1: context[" getStepResult"]("step1"),
        invalid: context[" getStepResult"]("invalid"),
      })
    })

    const workflow = createWorkflow(getNewWorkflowId(), function () {
      step1()
      step2("step2")
      return new WorkflowResponse(step3("step-3"))
    })

    const { result } = await workflow.run({ input: {} })
    expect(result).toEqual({
      input: "step-3",
      step1: {
        result: "step1",
      },
      step2: {
        result: "step2",
      },
    })
  })

  it("should allow reading results of a hook", async function () {
    const step1 = createStep("step1", async (_, context) => {
      return new StepResponse({ result: "step1" })
    })

    const workflow = createWorkflow(
      getNewWorkflowId(),
      function (input: { id: number }) {
        const step1Result = step1()
        const mutateInputHook = createHook("mutateInputHook", {
          input,
          step1Result,
        })

        return new WorkflowResponse(
          {
            input,
            step1Result,
            hookResult: mutateInputHook.getResult(),
          },
          {
            hooks: [mutateInputHook],
          }
        )
      }
    )

    workflow.hooks.mutateInputHook((data) => {
      return new StepResponse({
        input: {
          id: data.input.id + 1,
        },
        step1Result: {
          result: `mutated-${data.step1Result.result}`,
        },
      })
    })

    const { result } = await workflow.run({ input: { id: 1 } })
    expect(result).toEqual({
      input: { id: 1 },
      step1Result: { result: "step1" },
      hookResult: {
        input: {
          id: 2,
        },
        step1Result: { result: "mutated-step1" },
      },
    })
  })

  it("should allow specifying a validation schema for the hook response", async function () {
    const step1 = createStep("step1", async (_, context) => {
      return new StepResponse({ result: "step1" })
    })

    const workflow = createWorkflow(
      getNewWorkflowId(),

      function (input: { id: number }) {
        const step1Result = step1()
        const mutateInputHook = createHook(
          "mutateInputHook",
          {
            input,
            step1Result,
          },
          {
            resultValidator: z.object({
              id: z.number(),
            }),
          }
        )

        expectTypeOf(mutateInputHook.getResult).returns.toMatchTypeOf<
          { id: number } | undefined
        >()

        return new WorkflowResponse(
          {
            input,
            step1Result,
            hookResult: mutateInputHook.getResult(),
          },
          {
            hooks: [mutateInputHook],
          }
        )
      }
    )

    workflow.hooks.mutateInputHook((data) => {
      return new StepResponse({
        id: data.input.id + 1,
      })
    })

    const { result } = await workflow.run({ input: { id: 1 } })
    expect(result).toEqual({
      input: { id: 1 },
      step1Result: { result: "step1" },
      hookResult: {
        id: 2,
      },
    })
  })

  it("should validate and throw error when hook response is invalid", async function () {
    const step1 = createStep("step1", async (_, context) => {
      return new StepResponse({ result: "step1" })
    })

    const workflow = createWorkflow(
      getNewWorkflowId(),

      function (input: { id: number }) {
        const step1Result = step1()
        const mutateInputHook = createHook(
          "mutateInputHook",
          {
            input,
            step1Result,
          },
          {
            resultValidator: z.object({
              id: z.number(),
            }),
          }
        )

        expectTypeOf(mutateInputHook.getResult).returns.toMatchTypeOf<
          { id: number } | undefined
        >()

        return new WorkflowResponse(
          {
            input,
            step1Result,
            hookResult: mutateInputHook.getResult(),
          },
          {
            hooks: [mutateInputHook],
          }
        )
      }
    )

    workflow.hooks.mutateInputHook((data) => {
      return new StepResponse({} as any)
    })

    try {
      await workflow.run({ input: { id: 1 } })
      throw new Error("Expected workflow to fail")
    } catch (error) {
      expect(error).toHaveProperty("issues")
      expect(error.issues).toEqual([
        {
          code: "invalid_type",
          expected: "number",
          message: "Required",
          path: ["id"],
          received: "undefined",
        },
      ])
    }
  })

  it("should not validate when no hook handler has been defined", async function () {
    const step1 = createStep("step1", async () => {
      return new StepResponse({ result: "step1" })
    })

    const workflow = createWorkflow(
      getNewWorkflowId(),

      function (input: { id: number }) {
        const step1Result = step1()
        const mutateInputHook = createHook(
          "mutateInputHook",
          {
            input,
            step1Result,
          },
          {
            resultValidator: z.object({
              id: z.number(),
            }),
          }
        )

        expectTypeOf(mutateInputHook.getResult).returns.toMatchTypeOf<
          { id: number } | undefined
        >()

        return new WorkflowResponse(
          {
            input,
            step1Result,
            hookResult: mutateInputHook.getResult(),
          },
          {
            hooks: [mutateInputHook],
          }
        )
      }
    )

    const { result } = await workflow.run({ input: { id: 1 } })
    expect(result).toEqual({
      input: { id: 1 },
      step1Result: { result: "step1" },
      hookResult: undefined,
    })
  })

  it("should validate when hook returns undefined", async function () {
    const step1 = createStep("step1", async (_, context) => {
      return new StepResponse({ result: "step1" })
    })

    const workflow = createWorkflow(
      getNewWorkflowId(),

      function (input: { id: number }) {
        const step1Result = step1()
        const mutateInputHook = createHook(
          "mutateInputHook",
          {
            input,
            step1Result,
          },
          {
            resultValidator: z.object({
              id: z.number(),
            }),
          }
        )

        expectTypeOf(mutateInputHook.getResult).returns.toMatchTypeOf<
          { id: number } | undefined
        >()

        return new WorkflowResponse(
          {
            input,
            step1Result,
            hookResult: mutateInputHook.getResult(),
          },
          {
            hooks: [mutateInputHook],
          }
        )
      }
    )

    workflow.hooks.mutateInputHook((data) => {})
    try {
      await workflow.run({ input: { id: 1 } })
      throw new Error("Expected workflow to fail")
    } catch (error) {
      expect(error).toHaveProperty("issues")
      expect(error.issues).toEqual([
        {
          code: "invalid_type",
          expected: "object",
          message: "Required",
          path: [],
          received: "undefined",
        },
      ])
    }
  })
})
