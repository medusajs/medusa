import { useAdminUpdateSalesChannel } from "../../../../src"
import { renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"

describe("useAdminUpdateStore hook", () => {
  test("updates a store", async () => {
    const salesChannel = {
      name: "medusa sales channel",
      description: "main sales channel for medusa",
      is_disabled: true,
    }

    const salesChannelId = fixtures.get("sales_channel").id

    const { result, waitFor } = renderHook(
      () => useAdminUpdateSalesChannel(salesChannelId),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(salesChannel)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.sales_channel).toEqual({
      ...fixtures.get("sales_channel"),
      ...salesChannel,
    })
  })
})
