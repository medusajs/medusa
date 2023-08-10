import { mergeData } from "../merge-data"
import { WorkflowStepMiddlewareReturn } from "../pipe"

describe("merge", function () {
  it("should merge a new object from the source into a specify target", async function () {
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

    const result = (await mergeData(
      ["input", "another", "stringProp", "anArray"],
      "payload"
    )({ data: source } as any)) as unknown as WorkflowStepMiddlewareReturn

    expect(result).toEqual({
      alias: "payload",
      value: {
        ...source.input,
        ...source.another,
        anArray: source.anArray,
        stringProp: source.stringProp,
      },
    })
  })

  it("should merge a new object from the entire source into the resul object", async function () {
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

    const { value: result } = (await mergeData()({
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
