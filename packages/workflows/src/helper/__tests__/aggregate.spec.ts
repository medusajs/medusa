import { aggregateData } from "../aggregate"
import { WorkflowStepMiddlewareReturn } from "../pipe"

describe("aggregate", function () {
  it("should aggregate a new object from the source into a specify target", async function () {
    const source = {
      stringProp: "stringProp",
      anArray: ["anArray"],
      input: {
        test: "test",
      },
      another: {
        anotherTest: "anotherTest",
      },
    }

    const { value: result } = (await aggregateData(
      ["input", "another", "stringProp", "anArray"],
      "payload"
    )({ data: source } as any)) as unknown as WorkflowStepMiddlewareReturn

    expect(result).toEqual({
      payload: {
        ...source.input,
        ...source.another,
        anArray: source.anArray,
        stringProp: source.stringProp,
      },
    })
  })

  it("should aggregate a new object from the entire source into the resul object", async function () {
    const source = {
      stringProp: "stringProp",
      anArray: ["anArray"],
      input: {
        test: "test",
      },
      another: {
        anotherTest: "anotherTest",
      },
    }

    const { value: result } = (await aggregateData()({
      data: source,
    } as any)) as unknown as WorkflowStepMiddlewareReturn

    expect(result).toEqual({
      ...source.input,
      ...source.another,
      anArray: source.anArray,
      stringProp: source.stringProp,
    })
  })
})
