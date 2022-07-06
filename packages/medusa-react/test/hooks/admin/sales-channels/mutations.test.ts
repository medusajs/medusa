import { renderHook } from "@testing-library/react-hooks"

import { useAdminCreateSalesChannel } from "../../../../src"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"

describe("useAdminSalesChannel hook", () => {
  test("returns a sales channel", async () => {
    const salesChannel = {
      name: "sales channel 1 name",
      description: "sales channel 1 description",
    }

    const { result, waitFor } = renderHook(() => useAdminCreateSalesChannel(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(salesChannel)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.sales_channel).toEqual(
      expect.objectContaining({
        ...fixtures.get("sales_channel"),
        ...salesChannel,
      })
    )
  })
})
