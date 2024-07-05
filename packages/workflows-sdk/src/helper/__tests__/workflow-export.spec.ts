import { createMedusaContainer } from "@medusajs/utils"
import { MedusaWorkflow } from "../../medusa-workflow"
import { exportWorkflow } from "../workflow-export"

jest.mock("@medusajs/orchestration", () => {
  return {
    TransactionHandlerType: {
      INVOKE: "invoke",
      COMPENSATE: "compensate",
    },
    TransactionState: {
      FAILED: "failed",
      REVERTED: "reverted",
    },
    LocalWorkflow: jest.fn(() => {
      return {
        run: jest.fn(() => {
          return {
            getErrors: jest.fn(),
            getState: jest.fn(() => "done"),
            getContext: jest.fn(() => {
              return {
                invoke: { result_step: "invoke_test" },
              }
            }),
          }
        }),
        registerStepSuccess: jest.fn(() => {
          return {
            getErrors: jest.fn(),
            getState: jest.fn(() => "done"),
            getContext: jest.fn(() => {
              return {
                invoke: { result_step: "invoke_test" },
              }
            }),
          }
        }),
        registerStepFailure: jest.fn(() => {
          return {
            getErrors: jest.fn(),
            getState: jest.fn(() => "done"),
            getContext: jest.fn(() => {
              return {
                invoke: { result_step: "invoke_test" },
              }
            }),
          }
        }),
        cancel: jest.fn(() => {
          return {
            getErrors: jest.fn(),
            getState: jest.fn(() => "reverted"),
            getContext: jest.fn(() => {
              return {
                invoke: { result_step: "invoke_test" },
              }
            }),
          }
        }),
      }
    }),
  }
})

describe("Export Workflow", function () {
  afterEach(() => {
    MedusaWorkflow.workflows = {}
  })

  it("should prepare the input data before initializing the transaction", async function () {
    let transformedInput
    const prepare = jest.fn().mockImplementation(async (data) => {
      data.__transformed = true
      transformedInput = data

      return data
    })

    const work = exportWorkflow("id" as any, "result_step", prepare)

    const container = createMedusaContainer()
    const wfHandler = work(container)

    const input = {
      test: "payload",
    }

    const { result } = await wfHandler.run({
      input,
    })

    expect(input).toEqual({
      test: "payload",
    })

    expect(transformedInput).toEqual({
      test: "payload",
      __transformed: true,
    })

    expect(result).toEqual("invoke_test")
  })

  describe("Using the exported workflow run", function () {
    afterEach(() => {
      MedusaWorkflow.workflows = {}
    })

    it("should prepare the input data before initializing the transaction", async function () {
      let transformedInput
      const prepare = jest.fn().mockImplementation(async (data) => {
        data.__transformed = true
        transformedInput = data

        return data
      })

      const work = exportWorkflow("id" as any, "result_step", prepare)

      const input = {
        test: "payload",
      }

      const container = createMedusaContainer()

      const { result } = await work.run({
        input,
        container,
      })

      expect(input).toEqual({
        test: "payload",
      })

      expect(transformedInput).toEqual({
        test: "payload",
        __transformed: true,
      })

      expect(result).toEqual("invoke_test")
    })
  })
})
