import { useAdminSalesChannel } from "../../../../src"
import { renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"

describe("useAdminSalesChannel hook", () => {
  test("returns a product", async () => {
    const salesChannel = fixtures.get("sales_channel")
    const { result, waitFor } = renderHook(() => useAdminSalesChannel(salesChannel.id), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.sales_channel).toEqual(salesChannel)
  })
})
