import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { SalesChannelServiceMock } from "../../../../../services/__mocks__/sales-channel"

describe("DELETE /admin/sales-channels/:id/products/batch", () => {
  describe("remove product from a sales channel", () => {
    beforeAll(async () => {
      await request(
        "DELETE",
        `/admin/sales-channels/${IdMap.getId(
          "sales_channel_1"
        )}/products/batch`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
          payload: {
            product_ids: [{ id: IdMap.getId("sales_channel_1_product_1") }],
          },
          flags: ["sales_channels"],
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls the retrieve method from the sales channel service", () => {
      expect(SalesChannelServiceMock.removeProducts).toHaveBeenCalledTimes(1)
      expect(SalesChannelServiceMock.removeProducts).toHaveBeenCalledWith(
        IdMap.getId("sales_channel_1"),
        [IdMap.getId("sales_channel_1_product_1")]
      )
    })
  })
})
