import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminCreateGiftCard,
  useAdminDeleteGiftCard,
  useAdminUpdateGiftCard,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminCreateGiftCard hook", () => {
  test("creates a gift card and returns it", async () => {
    const gc = {
      value: 1000,
      region_id: "test-id",
    }

    const { result, waitFor } = renderHook(() => useAdminCreateGiftCard(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(gc)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.gift_card).toEqual(
      expect.objectContaining({
        ...fixtures.get("gift_card"),
        ...gc,
      })
    )
  })
})

describe("useAdminUpdateGiftCard hook", () => {
  test("updates a gift card and returns it", async () => {
    const gc = {
      value: 2000,
      region_id: "test-region",
    }

    const { result, waitFor } = renderHook(
      () => useAdminUpdateGiftCard(fixtures.get("gift_card").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(gc)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.gift_card).toEqual(
      expect.objectContaining({
        ...fixtures.get("gift_card"),
        ...gc,
      })
    )
  })
})

describe("useAdminDeleteGiftCard hook", () => {
  test("deletes a gift card", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminDeleteGiftCard(fixtures.get("gift_card").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: fixtures.get("gift_card").id,
        deleted: true,
      })
    )
  })
})
