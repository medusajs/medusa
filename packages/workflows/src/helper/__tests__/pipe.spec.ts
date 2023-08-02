import { pipe } from "../pipe"

describe("Pipe", function () {
  it("should evaluate the input object and append the values to the data object and return the result from the handler", async function () {
    const payload = { input: "input" }
    const output = { test: "test" }

    const handler = jest.fn().mockImplementation(async () => output)
    const input = {
      inputAlias: "input",
      invoke: [
        {
          from: "input",
          alias: "input",
        },
        {
          from: "input",
          alias: "inputData",
        },
      ],
    }

    const result = await pipe(input, handler)({ payload } as any)

    expect(handler).toHaveBeenCalled()
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          input: payload,
          inputData: payload,
        },
      })
    )

    expect(result).toBeDefined()
    expect(result).toEqual(output)
  })
})
