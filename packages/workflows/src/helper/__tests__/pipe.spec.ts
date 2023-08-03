import { pipe } from "../pipe"

describe("Pipe", function () {
  it("should evaluate the input object and append the values to the data object and return the result from the handler", async function () {
    const payload = { input: "input" }
    const output = { test: "test" }
    const invoke = {
      input: payload,
      step1: { ...payload, step1Data: { test: "test" } },
      step2: { ...payload, step2Data: { test: "test" } },
    }

    const handler = jest.fn().mockImplementation(async () => output)
    const input = {
      inputAlias: "payload",
      invoke: [
        {
          from: "payload",
          alias: "input",
        },
        {
          from: "step1",
          alias: "previousDataStep1",
        },
        {
          from: "step2",
          alias: "previousDataStep2",
        },
      ],
    }

    const result = await pipe(input, handler)({ invoke, payload } as any)

    expect(handler).toHaveBeenCalled()
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          input: payload,
          previousDataStep1: invoke.step1,
          previousDataStep2: invoke.step2,
        },
      })
    )

    expect(result).toBeDefined()
    expect(result).toEqual(output)
  })
})
