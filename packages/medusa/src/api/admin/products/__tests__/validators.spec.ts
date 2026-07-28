import { AdminUpdateProduct } from "../validators"

describe("AdminUpdateProduct", () => {
  const schema = AdminUpdateProduct()

  const variants = [
    {
      title: "20",
      options: { denomination: "20" },
    },
  ]

  const optionValueUpdates = [
    {
      product_option_id: "opt_123",
      add: [{ value: "20" }],
      remove: ["optval_123"],
    },
  ]

  it("accepts option value updates with variants", () => {
    expect(() =>
      schema.parse({
        variants,
        option_value_updates: optionValueUpdates,
      })
    ).not.toThrow()
  })

  it("rejects option value updates without variants", () => {
    const result = schema.safeParse({
      option_value_updates: optionValueUpdates,
    })

    expect(result.success).toBe(false)
  })

  it("rejects option value updates together with option ids", () => {
    const result = schema.safeParse({
      option_ids: ["opt_123"],
      variants,
      option_value_updates: optionValueUpdates,
    })

    expect(result.success).toBe(false)
  })

  it("rejects blank option values", () => {
    const result = schema.safeParse({
      variants,
      option_value_updates: [
        {
          product_option_id: "opt_123",
          add: [{ value: "   " }],
        },
      ],
    })

    expect(result.success).toBe(false)
  })
})
