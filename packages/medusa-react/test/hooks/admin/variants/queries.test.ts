import { useAdminVariant, useAdminVariants, useAdminVariantsInventory } from "../../../../src"

import { createWrapper } from "../../../utils"
import { fixtures } from "../../../../mocks/data"
import { renderHook } from "@testing-library/react-hooks"

describe("useAdminVariants hook", () => {
  test("returns a list of variants", async () => {
    const variants = fixtures.list("product_variant")
    const { result, waitFor } = renderHook(() => useAdminVariants(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.variants).toEqual(variants)
  })
})

describe("useAdminVariant hook", () => {
  test("returns a variant", async () => {
    const variant = fixtures.get("product_variant")
    const { result, waitFor } = renderHook(() => useAdminVariant(variant.id), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.variant).toEqual(variant)
  })
})

describe("useAdminVariants hook", () => {
  test("returns a variant with saleschannel locations", async () => {
    const variant = fixtures.get("product_variant")
    const { result, waitFor } = renderHook(
      () => useAdminVariantsInventory(variant.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.variant).toEqual({
      ...variant,
      sales_channel_availability: [
        {
          channel_name: "default channel",
          channel_id: "1",
          available_quantity: 10,
        },
      ],
    })
  })
})
