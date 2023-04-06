import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { SalesChannelServiceMock } from "../../../../../services/__mocks__/sales-channel"
import SalesChannelFeatureFlag from "../../../../../loaders/feature-flags/sales-channels";

describe("POST /admin/regions/:region_id/countries", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      const id = IdMap.getId("test_sales_channel")
      subject = await request("POST", `/admin/sales-channels/${id}`, {
        payload: {
          name: "amazon",
          description: "This is our amazon sales channel",
        },
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
        flags: [SalesChannelFeatureFlag],
      })
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns updated sales channel", () => {
      expect(subject.body.sales_channel).toEqual({
        id: IdMap.getId("test_sales_channel"),
        name: "amazon",
        description: "This is our amazon sales channel",
      })
    })

    it("calls service update", () => {
      expect(SalesChannelServiceMock.update).toHaveBeenCalledTimes(1)
      expect(SalesChannelServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("test_sales_channel"),
        {
          name: "amazon",
          description: "This is our amazon sales channel",
        }
      )
    })
  })
})
