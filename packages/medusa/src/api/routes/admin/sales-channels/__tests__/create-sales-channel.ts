import { IdMap } from "medusa-test-utils"

import { request } from "../../../../../helpers/test-request"
import { SalesChannelServiceMock } from "../../../../../services/__mocks__/sales-channel"

describe("POST /admin/sales-channels", () => {
  describe("successfully get a sales channel", () => {
    beforeAll(async () => {
      await request("POST", `/admin/sales-channels`, {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
        payload: {
          name: "sales channel 1 name",
          description: "sales channel 1 description",
        },
        flags: ["sales_channels"],
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
