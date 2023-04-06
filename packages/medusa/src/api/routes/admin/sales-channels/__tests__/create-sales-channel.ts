import { IdMap } from "medusa-test-utils"

import { request } from "../../../../../helpers/test-request"
import { SalesChannelServiceMock } from "../../../../../services/__mocks__/sales-channel"
import SalesChannelFeatureFlag from "../../../../../loaders/feature-flags/sales-channels";

describe("POST /admin/sales-channels", () => {
  describe("successfully get a sales channel", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/admin/sales-channels`, {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
        payload: {
          name: "sales channel 1 name",
          description: "sales channel 1 description",
        },
        flags: [SalesChannelFeatureFlag],
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls the create method from the sales channel service", () => {
      expect(SalesChannelServiceMock.create).toHaveBeenCalledTimes(1)
      expect(SalesChannelServiceMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "sales channel 1 name",
          description: "sales channel 1 description",
        })
      )
    })
  })
})
