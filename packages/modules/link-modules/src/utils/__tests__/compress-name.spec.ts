import { compressName } from "../compress-name"

describe("compressName", () => {
  it("should remove consecutive duplicate names in sequence if it exceds 58 chars", () => {
    const name =
      "product_product_variant_id_order_order_id_long_long_long_long_name"
    const result = compressName(name)
    expect(result).toBe("product_variant_id_order_id_long_name33bb7b344")
  })

  it("should remove duplicate names and truncate name to append a hash", () => {
    const name = "product_product_variant_id_order_order_id"
    const result = compressName(name, 30)
    expect(result).toBe("product_variant_id_ord91d0cda8")
  })

  it("handles very long names with truncation and appends hash when necessary", () => {
    const name =
      "CustomModuleImplementationContainingAReallyBigNameThatExceedsPosgresLimitToNameATableModule"
    const result = compressName(name)
    expect(result).toHaveLength(58)
    expect(result).toBe(
      "cust_modu_impl_cont_area_big_name_that_exce_posg_1f1cc72da"
    )
  })
})
