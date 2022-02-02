import { useGiftCard } from "../../../../src/"
import { renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"

describe("useGiftCard hook", () => {
  test("returns a gift card", async () => {
    const giftCard = fixtures.get("gift_card")
    const { result, waitFor } = renderHook(() => useGiftCard(giftCard.id), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.gift_card).toEqual(giftCard)
  })
})
