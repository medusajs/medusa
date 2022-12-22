import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { SalesChannelServiceMock } from "../../../../../services/__mocks__/sales-channel"
import SalesChannelFeatureFlag from "../../../../../loaders/feature-flags/sales-channels";

describe("GET /admin/sales-channels/:id", () => {
  describe("successfully get a sales channel", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/admin/sales-channels/${IdMap.getId("sales_channel_1")}`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
          flags: [SalesChannelFeatureFlag],
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls the retrieve method from the sales channel service", () => {
      expect(SalesChannelServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(SalesChannelServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("sales_channel_1"),
      )
    })

    it("returns the expected sales channel", () => {
      expect(subject.body.sales_channel).toEqual({
        id: IdMap.getId("sales_channel_1"),
        name: "sales channel 1 name",
        description: "sales channel 1 description",
        is_disabled: false,
      })
    })
  })
})
