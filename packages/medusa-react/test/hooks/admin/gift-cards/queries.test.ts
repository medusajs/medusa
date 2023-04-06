import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminGiftCard, useAdminGiftCards } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminGiftCards hook", () => {
  test("returns a list of giftCards", async () => {
    const giftCards = fixtures.list("gift_card")
    const { result, waitFor } = renderHook(() => useAdminGiftCards(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.gift_cards).toEqual(giftCards)
  })
})

describe("useAdminGiftCard hook", () => {
  test("returns a giftCard", async () => {
    const giftCard = fixtures.get("gift_card")
    const { result, waitFor } = renderHook(
      () => useAdminGiftCard(giftCard.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.gift_card).toEqual(giftCard)
  })
})
