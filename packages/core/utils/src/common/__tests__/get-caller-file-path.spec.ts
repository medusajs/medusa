import { getCallerFilePath } from "../get-caller-file-path"

// Stands in for an API such as createWorkflow, which asks for its caller's file
const callerOfThis = () => getCallerFilePath()

describe("getCallerFilePath", function () {
  it("should return the file calling the function", function () {
    expect(callerOfThis()).toEqual(__filename)
  })

  it("should fall back to the source URL of code evaluated from a string", function () {
    const evaluated = new Function(
      "callerOfThis",
      "return callerOfThis()\n//# sourceURL=/virtual/src/workflows/my-workflow.ts"
    )

    expect(evaluated(callerOfThis)).toEqual(
      "/virtual/src/workflows/my-workflow.ts"
    )
  })
})
