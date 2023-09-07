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

  it("should evaluate the input object and append the values to the data object using the merge and return the result from the handler", async function () {
    const payload = { input: "input" }
    const output = { test: "test" }
    const invoke = {
      input: payload,
      step1: { step1Data: { test: "test" } },
      step2: [{ test: "test" }],
    }

    const handler = jest.fn().mockImplementation(async () => output)
    const input = {
      inputAlias: "payload",
      merge: true,
      invoke: [
        {
          from: "payload",
        },
        {
          from: "step1",
        },
        {
          from: "step2",
          alias: "step2Data",
        },
      ],
    }

    const result = await pipe(input, handler)({ invoke, payload } as any)

    expect(handler).toHaveBeenCalled()
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          ...payload,
          ...invoke.step1,
          step2Data: invoke.step2,
        },
      })
    )

    expect(result).toBeDefined()
    expect(result).toEqual(output)
  })

  it("should evaluate the input object and append the values to the data object using the merge to store on the merge alias and return the result from the handler", async function () {
    const payload = { input: "input" }
    const output = { test: "test" }
    const invoke = {
      input: payload,
      step1: { step1Data: { test: "test" } },
      step2: { step2Data: { test: "test" } },
    }

    const handler = jest.fn().mockImplementation(async () => output)
    const input = {
      inputAlias: "payload",
      mergeAlias: "mergedData",
      invoke: [
        {
          from: "payload",
          alias: "input",
        },
        {
          from: "step1",
          alias: "step1Data",
        },
        {
          from: "step2",
          alias: "step2Data",
        },
      ],
    }

    const result = await pipe(input, handler)({ invoke, payload } as any)

    expect(handler).toHaveBeenCalled()
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          input: payload,
          step1Data: invoke.step1,
          step2Data: invoke.step2,
          mergedData: {
            ...payload,
            ...invoke.step1,
            ...invoke.step2,
          },
        },
      })
    )

    expect(result).toBeDefined()
    expect(result).toEqual(output)
  })

  it("should evaluate the input object and append the values to the data object using the merge to store on the merge alias from the merge from values and return the result from the handler", async function () {
    const payload = { input: "input" }
    const output = { test: "test" }
    const invoke = {
      input: payload,
      step1: { step1Data: { test: "test" } },
      step2: { step2Data: { test: "test" } },
    }

    const handler = jest.fn().mockImplementation(async () => output)
    const input = {
      inputAlias: "payload",
      mergeAlias: "mergedData",
      mergeFrom: ["input", "step1Data"],
      invoke: [
        {
          from: "payload",
          alias: "input",
        },
        {
          from: "step1",
          alias: "step1Data",
        },
        {
          from: "step2",
          alias: "step2Data",
        },
      ],
    }

    const result = await pipe(input, handler)({ invoke, payload } as any)

    expect(handler).toHaveBeenCalled()
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          input: payload,
          step1Data: invoke.step1,
          step2Data: invoke.step2,
          mergedData: {
            ...payload,
            ...invoke.step1,
          },
        },
      })
    )

    expect(result).toBeDefined()
    expect(result).toEqual(output)
  })

  it("should execute onComplete function if available but the output result shouldn't change", async function () {
    const payload = { input: "input" }
    const output = { test: "test" }
    const invoke = {
      input: payload,
    }

    const onComplete = jest.fn(async ({ data }) => {
      data.__changed = true

      return
    })

    const handler = jest.fn().mockImplementation(async () => output)
    const input = {
      inputAlias: "payload",
      invoke: [
        {
          from: "payload",
          alias: "input",
        },
      ],
      onComplete,
    }

    const result = await pipe(input, handler)({ invoke, payload } as any)

    expect(handler).toHaveBeenCalled()
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          input: payload,
        },
      })
    )

    expect(onComplete).toHaveBeenCalled()
    expect(result).toEqual(output)
  })
})
