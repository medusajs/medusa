import { DiscountConditionOperator } from "@medusajs/medusa"
import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminAddDiscountConditionResourceBatch,
  useAdminCreateDiscount,
  useAdminCreateDynamicDiscountCode,
  useAdminDeleteDiscount,
  useAdminDeleteDiscountConditionResourceBatch,
  useAdminDeleteDynamicDiscountCode,
  useAdminDiscountAddRegion,
  useAdminDiscountCreateCondition,
  useAdminDiscountRemoveCondition,
  useAdminDiscountRemoveRegion,
  useAdminDiscountUpdateCondition,
  useAdminUpdateDiscount,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminDeleteDiscountConditionResourceBatch hook", () => {
  test("delete items from a discount condition and return the discount", async () => {
    const resources = [
      {
        id: fixtures.get("product").id,
      },
    ]
    const discountId = fixtures.get("discount").id
    const conditionId = fixtures.get("discount").rule.conditions[0].id

    const { result, waitFor } = renderHook(
      () =>
        useAdminDeleteDiscountConditionResourceBatch(discountId, conditionId),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      resources,
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.discount).toEqual(
      expect.objectContaining({
        ...fixtures.get("discount"),
        rule: {
          ...fixtures.get("discount").rule,
          conditions: [
            {
              ...fixtures.get("discount").rule.conditions[0],
              products: [],
            },
          ],
        },
      })
    )
  })
})

describe("useAdminAddDiscountConditionResourceBatch hook", () => {
  test("add items to a discount condition and return the discount", async () => {
    const resources = [
      {
        id: fixtures.get("product").id,
      },
    ]
    const discountId = fixtures.get("discount").id
    const conditionId = fixtures.get("discount").rule.conditions[0].id

    const { result, waitFor } = renderHook(
      () => useAdminAddDiscountConditionResourceBatch(discountId, conditionId),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({ resources })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.discount).toEqual(
      expect.objectContaining({
        ...fixtures.get("discount"),
        rule: {
          ...fixtures.get("discount").rule,
          conditions: [
            {
              ...fixtures.get("discount").rule.conditions[0],
              products: [
                ...(fixtures.get("discount").rule.conditions[0]?.products ??
                  []),
                { id: fixtures.get("product").id },
              ],
            },
          ],
        },
      })
    )
  })
})

describe("useAdminCreateDiscount hook", () => {
  test("creates a discount and returns it", async () => {
    const discount = {
      code: "DISC",
      rule: {
        type: "percentage",
        value: 10,
        allocation: "total",
      },
      is_dynamic: false,
      is_disabled: false,
    }

    const { result, waitFor } = renderHook(() => useAdminCreateDiscount(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(discount)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.discount).toEqual(
      expect.objectContaining({
        ...fixtures.get("discount"),
        ...discount,
      })
    )
  })
})

describe("useAdminUpdateDiscount hook", () => {
  test("updates a discount and returns it", async () => {
    const discount = {
      code: "SUMMER10",
    }

    const { result, waitFor } = renderHook(
      () => useAdminUpdateDiscount(fixtures.get("discount").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(discount)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.discount).toEqual(
      expect.objectContaining({
        ...fixtures.get("discount"),
        ...discount,
      })
    )
  })
})

describe("useAdminDeleteDiscount hook", () => {
  test("updates a discount and returns it", async () => {
    const id = fixtures.get("discount").id

    const { result, waitFor } = renderHook(() => useAdminDeleteDiscount(id), {
      wrapper: createWrapper(),
    })

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id,
        deleted: true,
      })
    )
  })
})

describe("useAdminDiscountAddRegion hook", () => {
  test("adds a region to the discount", async () => {
    const id = fixtures.get("discount").id

    const { result, waitFor } = renderHook(
      () => useAdminDiscountAddRegion(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate("test-region")

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.discount).toEqual(
      expect.objectContaining(fixtures.get("discount"))
    )
  })
})

describe("useAdminCreateDynamicDiscountCode hook", () => {
  test("creates a dynamic discount code", async () => {
    const discount = {
      code: "LUCKY10",
      usage_limit: 10,
    }

    const { result, waitFor } = renderHook(
      () => useAdminCreateDynamicDiscountCode(fixtures.get("discount").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(discount)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.discount).toEqual(
      expect.objectContaining({
        ...fixtures.get("discount"),
        ...discount,
      })
    )
  })
})

describe("useAdminDiscountRemoveRegion hook", () => {
  test("adds a region to the discount", async () => {
    const id = fixtures.get("discount").id

    const { result, waitFor } = renderHook(
      () => useAdminDiscountRemoveRegion(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate("test-region")

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.discount).toEqual(
      expect.objectContaining(fixtures.get("discount"))
    )
  })
})

describe("useAdminDeleteDynamicDiscountCode hook", () => {
  test("creates a dynamic discount code", async () => {
    const id = fixtures.get("discount").id

    const { result, waitFor } = renderHook(
      () => useAdminDeleteDynamicDiscountCode(fixtures.get("discount").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate("LUCKY10")

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.discount).toEqual(
      expect.objectContaining(fixtures.get("discount"))
    )
  })
})

describe("useAdminDiscountCreateCondition hook", () => {
  test("Creates a condition from a discount", async () => {
    const id = fixtures.get("discount").id
    const conditionId = fixtures.get("discount").rule.conditions[0].id

    const { result, waitFor } = renderHook(
      () => useAdminDiscountCreateCondition(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      operator: DiscountConditionOperator.IN,
      products: ["test-product"],
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.discount).toEqual(fixtures.get("discount"))
  })
})
describe("useAdminDiscountUpdateCondition hook", () => {
  test("Updates condition for discount", async () => {
    const id = fixtures.get("discount").id
    const conditionId = fixtures.get("discount").rule.conditions[0].id

    const { result, waitFor } = renderHook(
      () => useAdminDiscountUpdateCondition(id, conditionId),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({ products: ["test-product"] })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.discount).toEqual(fixtures.get("discount"))
  })
})

describe("useAdminDiscountRemoveCondition hook", () => {
  test("removes a condition from a discount", async () => {
    const id = fixtures.get("discount").id
    const conditionId = fixtures.get("discount").rule.conditions[0].id

    const { result, waitFor } = renderHook(
      () => useAdminDiscountRemoveCondition(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(conditionId)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.id).toEqual(conditionId)
  })
})
