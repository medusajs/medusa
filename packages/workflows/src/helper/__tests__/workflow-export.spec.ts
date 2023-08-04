import { LocalWorkflow } from "@medusajs/orchestration"
import { exportWorkflow } from "../workflow-export"

jest.mock("@medusajs/orchestration", () => {
  return {
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
      }
    }),
  }
})

describe("Export Workflow", function () {
  it("should prepare the input data before initializing the transaction", async function () {
    let transformedInput
    const prepare = jest.fn().mockImplementation(async (data) => {
      data.__transformed = true
      transformedInput = data

      return data
    })

    let a: LocalWorkflow

    const work = exportWorkflow("id" as any, "result", prepare)

    const wfHandler = work()

    const input = {
      test: "payload",
    }

    const { result } = await wfHandler.run({
      input,
      resultFrom: "result_step",
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
