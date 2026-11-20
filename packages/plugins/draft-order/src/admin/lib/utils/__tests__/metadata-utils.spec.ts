import { parseValues } from "../metadata-utils"

describe("parseValues", () => {
  it("should send keys removed from the form as empty strings so they are deleted", () => {
    const original = { keep: "a", removed: "b", count: 3 }

    const result = parseValues(
      {
        metadata: [
          { key: "keep", value: "a" },
          { key: "count", value: "3" },
        ],
      },
      original
    )

    expect(result).toEqual({ keep: "a", count: 3, removed: "" })
  })

  it("should send a key whose value was cleared as an empty string", () => {
    const result = parseValues(
      {
        metadata: [
          { key: "keep", value: "a" },
          { key: "cleared", value: "" },
        ],
      },
      { keep: "a", cleared: "b" }
    )

    expect(result).toEqual({ keep: "a", cleared: "" })
  })

  it("should only parse strictly numeric values as numbers", () => {
    const result = parseValues({
      metadata: [
        { key: "mixed", value: "12abc" },
        { key: "int", value: "12" },
        { key: "negative", value: "-1.5" },
        { key: "bool", value: "true" },
      ],
    })

    expect(result).toEqual({
      mixed: "12abc",
      int: 12,
      negative: -1.5,
      bool: true,
    })
  })

  it("should keep disabled rows as-is", () => {
    const result = parseValues(
      {
        metadata: [
          { key: "nested", value: { a: 1 }, disabled: true },
          { key: "keep", value: "a" },
        ],
      },
      { nested: { a: 1 }, keep: "a" }
    )

    expect(result).toEqual({ nested: { a: 1 }, keep: "a" })
  })
})
