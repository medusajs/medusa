import { StepResponse } from "../../utils/composer/helpers/step-response"
import { toStepResult } from "../handlers"

describe("toStepResult", () => {
  it("waits for an async step to be completed from outside", () => {
    expect(toStepResult(undefined, { config: { async: true } })).toEqual({
      kind: "wait",
    })
  })

  it("completes an async step that returns a step response", () => {
    expect(
      toStepResult(new StepResponse("out"), { config: { async: true } })
    ).toEqual(expect.objectContaining({ kind: "output", output: "out" }))
  })

  it("completes a background step with whatever it returned", () => {
    expect(
      toStepResult(undefined, {
        config: { async: true, backgroundExecution: true },
      })
    ).toEqual({ kind: "output", output: undefined, compensateInput: undefined })
  })

  it("waits for the child of a background step that hosts one", () => {
    expect(
      toStepResult(undefined, {
        config: { async: true, backgroundExecution: true, nested: true },
      })
    ).toEqual({ kind: "wait" })
  })
})
