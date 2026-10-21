import { OrchestrationUtils, parseStringifyIfNecessary } from "@medusajs/utils"
import { resolveValue } from "../helpers/resolve-value"
import { proxify } from "../helpers/proxy"
import { StepResponse } from "../helpers/step-response"
import { WorkflowResponse } from "../helpers/workflow-response"
import { transform } from "../transform"
import { WorkflowData } from "../type"

jest.mock("@medusajs/utils", () => {
  const actual = jest.requireActual("@medusajs/utils")
  return {
    ...actual,
    parseStringifyIfNecessary: jest.fn(actual.parseStringifyIfNecessary),
  }
})

const serialize = jest.mocked(parseStringifyIfNecessary)

const createCatalog = () => ({
  products: [
    { variants: [{ prices: [{ amount: 10 }, { amount: 20 }] }] },
    { variants: [{ prices: [{ amount: 30 }] }] },
  ],
})

describe("resolveValue", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("serializes nested arrays once instead of once per element and ancestor", () => {
    const input = createCatalog()
    const result = resolveValue(input, { invoke: {} })

    expect(result).toEqual(input)
    expect(serialize).toHaveBeenCalledTimes(1)

    result.products[0].variants[0].prices[0].amount = 100
    expect(input.products[0].variants[0].prices[0].amount).toBe(10)
  })

  it("serializes workflow response wrappers only at the outer boundary", () => {
    const input = createCatalog()
    const response = new WorkflowResponse(new WorkflowResponse(input))
    const result = resolveValue(response, { invoke: {} })

    expect(result).toEqual(input)
    expect(serialize).toHaveBeenCalledTimes(1)
    result.products[0].variants[0].prices[0].amount = 100
    expect(input.products[0].variants[0].prices[0].amount).toBe(10)
  })

  it("resolves properties without more copying or traversal than an explicit transform", async () => {
    const readUnused = jest.fn(() => "unselected")
    const payload = {
      ...createCatalog(),
      get unused() {
        return readUnused()
      },
    }
    const input = proxify<WorkflowData<typeof payload>>({
      __type: OrchestrationUtils.SymbolInputReference,
    } as WorkflowData<typeof payload>)
    const context = { invoke: {}, payload }

    const property = await resolveValue(input.products, context)
    const propertyCopies = serialize.mock.calls.length
    const propertyReads = readUnused.mock.calls.length
    serialize.mockClear()
    readUnused.mockClear()

    const explicit = await resolveValue(
      transform(input, (data) => data.products),
      context
    )

    expect(property).toEqual(explicit)
    expect(propertyCopies).toBe(serialize.mock.calls.length)
    expect(propertyReads).toBe(readUnused.mock.calls.length)
    property[0].variants[0].prices[0].amount = 100
    expect(payload.products[0].variants[0].prices[0].amount).toBe(10)
    expect(explicit[0].variants[0].prices[0].amount).toBe(10)
  })

  it("detaches step responses used inside nested arrays", () => {
    const output = createCatalog()
    const step = new StepResponse(output)
    const result = resolveValue({ batches: [[step, step]] }, { invoke: {} })

    expect(result.batches).toEqual([[output, output]])
    result.batches[0][0].products[0].variants[0].prices[0].amount = 100
    expect(output.products[0].variants[0].prices[0].amount).toBe(10)
    expect(result.batches[0][1].products[0].variants[0].prices[0].amount).toBe(
      10
    )
  })

  it("detaches cached transform results on every resolution", async () => {
    const output = createCatalog()
    const temporaryData = new Map<string, unknown>()
    const context = {
      invoke: {},
      transaction: {
        modelId: "test-workflow",
        transactionId: "test-transaction",
        hasTemporaryData: (key: string) => temporaryData.has(key),
        getTemporaryData: (key: string) => temporaryData.get(key),
        setTemporaryData: (key: string, value: unknown) =>
          temporaryData.set(key, value),
      },
    }
    const handler = jest.fn(async () => output)
    const transformed = transform({}, handler)

    const first = await resolveValue({ batches: [transformed] }, context)
    first.batches[0].products[0].variants[0].prices[0].amount = 100
    const second = await resolveValue({ batches: [transformed] }, context)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(second.batches[0]).toEqual(output)
    expect(output.products[0].variants[0].prices[0].amount).toBe(10)
  })

  it("preserves ordering and serialization for synchronous and asynchronous references", async () => {
    const date = new Date("2026-01-01T00:00:00.000Z")
    const asynchronous = transform({}, async () => ({
      key: "value",
      prices: [{ amount: 10 }],
      date,
    }))
    const input = {
      __type: OrchestrationUtils.SymbolWorkflowWorkflowData,
      output: [
        { nested: asynchronous },
        { __type: OrchestrationUtils.SymbolInputReference },
        null,
        undefined,
        date,
        7,
      ],
    }

    const result = await resolveValue(input, {
      invoke: {},
      payload: { value: "input" },
    })

    expect(result).toEqual([
      {
        nested: {
          key: "value",
          prices: [{ amount: 10 }],
          date: date.toISOString(),
        },
      },
      { value: "input" },
      null,
      undefined,
      date.toISOString(),
      7,
    ])
  })

  it("propagates synchronous serialization errors and asynchronous rejections", async () => {
    const error = new Error("Cannot serialize")
    const input = {
      values: [
        {
          get amount() {
            throw error
          },
        },
      ],
    }
    expect(() => resolveValue(input, { invoke: {} })).toThrow(error)

    const rejected = transform({}, async () => {
      throw error
    })
    await expect(
      resolveValue({ values: [rejected] }, { invoke: {} })
    ).rejects.toThrow(error)
  })
})
