import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { SalesChannelServiceMock } from "../../../../../services/__mocks__/sales-channel"
import SalesChannelFeatureFlag from "../../../../../loaders/feature-flags/sales-channels";

describe("GET /admin/sales-channels/", () => {
  describe("successfully list the sales channel", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/admin/sales-channels`,
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

    it("calls the listAndCount method from the sales channel service", () => {
      expect(SalesChannelServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(SalesChannelServiceMock.listAndCount).toHaveBeenCalledWith(
          {},
          {
            order: { created_at: "DESC" },
            relations: [],
            skip: 0,
            take: 20
          }
      )
    })

    it("returns the expected sales channel", () => {
      expect(subject.body).toEqual({
        sales_channels: [{
          id: IdMap.getId("sales_channel_1"),
          name: "sales channel 1 name",
          description: "sales channel 1 description",
          is_disabled: false,
        }],
        offset: 0,
        limit: 20,
        count: 1,
      })
    })
  })
})
