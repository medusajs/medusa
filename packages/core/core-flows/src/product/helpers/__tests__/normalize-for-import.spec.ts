import { normalizeForImport } from "../normalize-for-import"

// The helper accepts arbitrary raw row objects (post CSV parsing) and a
// regions/tags context. Only option-related behavior is exercised here, so
// the rest of the row is kept minimal.
const baseRow = (overrides: Record<string, any> = {}) => ({
  "Product Handle": "p1",
  "Product Title": "P1",
  "Product Status": "draft",
  "Variant Title": "v1",
  ...overrides,
})

const ctx = { regions: [], tags: [] }

describe("normalizeForImport — option metadata extraction", () => {
  it("emits no id or is_exclusive when the row has neither column", () => {
    const [product] = normalizeForImport(
      [
        baseRow({
          "Variant Option 1 Name": "Size",
          "Variant Option 1 Value": "S",
        }),
      ],
      ctx
    )

    expect(product.options).toEqual([
      { title: "Size", values: ["S"] },
    ])
  })

  it("carries the option id when the row has a Variant Option N Id column", () => {
    const [product] = normalizeForImport(
      [
        baseRow({
          "Variant Option 1 Id": "opt_existing",
          "Variant Option 1 Name": "Size",
          "Variant Option 1 Value": "S",
        }),
      ],
      ctx
    )

    expect(product.options).toEqual([
      { title: "Size", values: ["S"], id: "opt_existing" },
    ])
  })

  it("carries is_exclusive when the row has a Variant Option N Is Exclusive column", () => {
    const [product] = normalizeForImport(
      [
        baseRow({
          "Variant Option 1 Name": "Color",
          "Variant Option 1 Value": "Red",
          "Variant Option 1 Is Exclusive": "false",
        }),
      ],
      ctx
    )

    expect(product.options).toEqual([
      { title: "Color", values: ["Red"], is_exclusive: false },
    ])
  })

  it("merges meta across rows of the same product — first non-empty wins", () => {
    const [product] = normalizeForImport(
      [
        baseRow({
          "Variant Title": "v1",
          "Variant Option 1 Id": "opt_global_color",
          "Variant Option 1 Name": "Color",
          "Variant Option 1 Value": "Red",
        }),
        baseRow({
          "Variant Title": "v2",
          // Second row omits the id — should not clobber the value from row 1.
          "Variant Option 1 Name": "Color",
          "Variant Option 1 Value": "Blue",
        }),
      ],
      ctx
    )

    expect(product.options).toHaveLength(1)
    expect(product.options![0]).toEqual({
      title: "Color",
      values: expect.arrayContaining(["Red", "Blue"]),
      id: "opt_global_color",
    })
  })

  it("does not bleed meta across different product handles", () => {
    const products = normalizeForImport(
      [
        baseRow({
          "Product Handle": "p1",
          "Variant Option 1 Id": "opt_a",
          "Variant Option 1 Name": "Color",
          "Variant Option 1 Value": "Red",
        }),
        baseRow({
          "Product Handle": "p2",
          // Same option title, no id supplied — should NOT inherit opt_a.
          "Variant Option 1 Name": "Color",
          "Variant Option 1 Value": "Red",
        }),
      ],
      ctx
    )

    expect(products).toHaveLength(2)
    const p1 = products.find((p) => p.handle === "p1")!
    const p2 = products.find((p) => p.handle === "p2")!
    expect(p1.options).toEqual([
      { title: "Color", values: ["Red"], id: "opt_a" },
    ])
    expect(p2.options).toEqual([{ title: "Color", values: ["Red"] }])
  })

  it("parses Is Exclusive tolerantly (true/false/yes/no/1/0, case-insensitive)", () => {
    const cases: Array<{ raw: string; expected: boolean | undefined }> = [
      { raw: "true", expected: true },
      { raw: "TRUE", expected: true },
      { raw: "False", expected: false },
      { raw: "yes", expected: true },
      { raw: "no", expected: false },
      { raw: "1", expected: true },
      { raw: "0", expected: false },
      { raw: "garbage", expected: undefined },
    ]

    cases.forEach(({ raw, expected }, idx) => {
      const [product] = normalizeForImport(
        [
          baseRow({
            "Product Handle": `handle-${idx}`,
            "Variant Option 1 Name": "Color",
            "Variant Option 1 Value": "Red",
            "Variant Option 1 Is Exclusive": raw,
          }),
        ],
        ctx
      )

      const option = product.options![0] as any
      if (expected === undefined) {
        expect(option).toEqual({ title: "Color", values: ["Red"] })
      } else {
        expect(option).toEqual({
          title: "Color",
          values: ["Red"],
          is_exclusive: expected,
        })
      }
    })
  })

  it("ignores Is Exclusive when an Id is also provided (id takes precedence)", () => {
    // We don't actively strip is_exclusive — the consuming step decides what
    // to do — but verify the helper still carries both through so the step
    // can apply the precedence rule.
    const [product] = normalizeForImport(
      [
        baseRow({
          "Variant Option 1 Id": "opt_existing",
          "Variant Option 1 Name": "Color",
          "Variant Option 1 Value": "Red",
          "Variant Option 1 Is Exclusive": "false",
        }),
      ],
      ctx
    )

    expect(product.options![0]).toEqual({
      title: "Color",
      values: ["Red"],
      id: "opt_existing",
      is_exclusive: false,
    })
  })
})
