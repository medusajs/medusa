import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminCreateVariant,
  useAdminDeleteVariant,
  useAdminUpdateVariant,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminCreateVariant hook", () => {
  test("creates a variant and returns it", async () => {
    const variant = {
      title: "Test variant",
      inventory_quantity: 10,
      prices: [
        {
          amount: 1000,
        },
      ],
      options: [],
    }

    const { result, waitFor } = renderHook(
      () => useAdminCreateVariant("test-product"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(variant)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.product).toEqual(fixtures.get("product"))
  })
})

describe("useAdminUpdateVariant hook", () => {
  test("updates a variant and returns it", async () => {
    const variant = {
      title: "Example variant",
      inventory_quantity: 5,
      prices: [],
      options: [],
    }

    const { result, waitFor } = renderHook(
      () => useAdminUpdateVariant("test-product"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      ...variant,
      variant_id: "test-variant",
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.product).toEqual(fixtures.get("product"))
  })
})

describe("useAdminDeleteVariant hook", () => {
  test("deletes a variant", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminDeleteVariant("test-product"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate("test-variant")

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        variant_id: "test-variant",
        deleted: true,
      })
    )
  })
})
