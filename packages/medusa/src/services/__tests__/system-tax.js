import SystemTaxService from "../system-tax"

describe("SystemTaxService", () => {
  describe("getTaxLines", () => {
    const taxService = new SystemTaxService()

    const calculationContext = {
      region: {},
      customer: {},
      allocation_map: {},
      shipping_address: {},
    }

    test("success", async () => {
      const lines = await taxService.getTaxLines(
        [
          {
            item: { id: "line_id" },
            rates: [
              { rate: 20, name: "test", code: "test" },
              { rate: 5.5, name: "test_2", code: "test_2" },
            ],
          },
        ],
        [],
        calculationContext
      )
      expect(lines).toEqual([
        {
          item_id: "line_id",
          rate: 20,
          name: "test",
          code: "test",
        },
        {
          item_id: "line_id",
          rate: 5.5,
          name: "test_2",
          code: "test_2",
        },
      ])
    })

    test("success w. shipping", async () => {
      const lines = await taxService.getTaxLines(
        [
          {
            item: { id: "line_id" },
            rates: [
              { rate: 20, name: "test", code: "test" },
              { rate: 5.5, name: "test_2", code: "test_2" },
            ],
          },
        ],
        [
          {
            shipping_method: { id: "sm_id" },
            rates: [{ rate: 20, name: "test", code: "test" }],
          },
        ],
        calculationContext
      )
      expect(lines).toEqual([
        {
          item_id: "line_id",
          rate: 20,
          name: "test",
          code: "test",
        },
        {
          item_id: "line_id",
          rate: 5.5,
          name: "test_2",
          code: "test_2",
        },
        {
          shipping_method_id: "sm_id",
          rate: 20,
          name: "test",
          code: "test",
        },
      ])
    })
  })
})
