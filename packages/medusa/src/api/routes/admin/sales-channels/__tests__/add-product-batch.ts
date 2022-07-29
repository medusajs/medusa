import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { SalesChannelServiceMock } from "../../../../../services/__mocks__/sales-channel"

describe("POST /admin/sales-channels/:id/products/batch", () => {
  describe("add product to a sales channel", () => {
    beforeAll(async () => {
      await request(
        "POST",
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

    afterAll( () => {
      jest.clearAllMocks()
    })

    it("calls the retrieve method from the sales channel service", () => {
      expect(SalesChannelServiceMock.addProducts).toHaveBeenCalledTimes(1)
      expect(SalesChannelServiceMock.addProducts).toHaveBeenCalledWith(
        IdMap.getId("sales_channel_1"),
        [IdMap.getId("sales_channel_1_product_1")]
      )
    })
  })
})
