import { GiftCardCreateSchema } from "../schema";

describe("GiftCardCreateSchema", () => {
  it("accepts a value formatted with a comma decimal separator", () => {
    const result = GiftCardCreateSchema.safeParse({
      value: { value: "14,13", float: 14.13 },
      currency_code: "eur",
    });

    expect(result.success).toBe(true);
    expect(result.data?.value.float).toBe(14.13);
  });

  it("accepts a value formatted with a dot decimal separator", () => {
    const result = GiftCardCreateSchema.safeParse({
      value: { value: "14.13", float: 14.13 },
      currency_code: "usd",
    });

    expect(result.success).toBe(true);
    expect(result.data?.value.float).toBe(14.13);
  });

  it("keeps the formatted value alongside the parsed number", () => {
    const result = GiftCardCreateSchema.safeParse({
      value: { value: "14,13", float: 14.13 },
      currency_code: "eur",
    });

    expect(result.data?.value).toEqual({ value: "14,13", float: 14.13 });
  });

  it("rejects a value that is not a number", () => {
    const result = GiftCardCreateSchema.safeParse({
      value: { value: "14,13", float: "not a number" },
      currency_code: "eur",
    });

    expect(result.success).toBe(false);
  });
});
