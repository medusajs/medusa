import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { SalesChannelServiceMock } from "../../../../../services/__mocks__/sales-channel"

describe("DELETE /admin/sales-channels/:id", () => {
  describe("successfully delete a sales channel", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
        `/admin/sales-channels/${IdMap.getId("sales_channel_1")}`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
          flags: ["sales_channels"],
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls the delete method from the sales channel service", () => {
      expect(SalesChannelServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(SalesChannelServiceMock.delete).toHaveBeenCalledWith(
        IdMap.getId("sales_channel_1")
      )
    })

    it("returns the expected result", () => {
      expect(subject.body).toEqual({
        id: IdMap.getId("sales_channel_1"),
        object: "sales-channel",
        deleted: true,
      })
    })
  })
})
