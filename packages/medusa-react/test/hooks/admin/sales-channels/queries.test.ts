import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminSalesChannel, useAdminSalesChannels } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminSalesChannel hook", () => {
  test("returns a sales channel", async () => {
    const salesChannel = fixtures.get("sales_channel")
    const { result, waitFor } = renderHook(
      () => useAdminSalesChannel(salesChannel.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.sales_channel).toEqual(salesChannel)
  })
})

describe("useAdminSalesChannels hook", () => {
  test("returns a list of sales channels", async () => {
    const salesChannels = fixtures.get("sales_channels")
    const { result, waitFor } = renderHook(() => useAdminSalesChannels(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.sales_channels).toEqual(salesChannels)
  })
})
