import { GiftCardCreateSchema } from "../schema"

const baseInput = {
  currency_code: "eur",
  expires_at: null,
  note: "",
  metadata: {},
}

describe("GiftCardCreateSchema", () => {
  it("should accept a value entered with a comma decimal separator", () => {
    const result = GiftCardCreateSchema.safeParse({
      ...baseInput,
      value: { value: "14,13", float: 14.13 },
    })

    expect(result.success).toBe(true)
    expect(result.data?.value.float).toBe(14.13)
  })

  it("should accept a value entered with a dot decimal separator", () => {
    const result = GiftCardCreateSchema.safeParse({
      ...baseInput,
      value: { value: "14.13", float: 14.13 },
    })

    expect(result.success).toBe(true)
    expect(result.data?.value.float).toBe(14.13)
  })

  it("should reject an empty value on the value field", () => {
    const result = GiftCardCreateSchema.safeParse({
      ...baseInput,
      value: { value: "", float: null },
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues).toEqual([
      expect.objectContaining({
        path: ["value"],
        message: "Value must be a positive number",
      }),
    ])
  })

  it("should reject a zero value on the value field", () => {
    const result = GiftCardCreateSchema.safeParse({
      ...baseInput,
      value: { value: "0", float: 0 },
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues).toEqual([
      expect.objectContaining({
        path: ["value"],
        message: "Value must be a positive number",
      }),
    ])
  })
})
